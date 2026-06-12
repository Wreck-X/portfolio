<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	const VERT = `
		attribute vec2 a_pos;
		void main() {
			gl_Position = vec4(a_pos, 0.0, 1.0);
		}
	`;

	const FRAG = `
		precision highp float;

		uniform vec2 u_res;
		uniform float u_time;
		uniform vec2 u_mouse;

		float hash(vec2 p) {
			p = fract(p * vec2(123.34, 456.21));
			p += dot(p, p + 45.32);
			return fract(p.x * p.y);
		}

		float noise(vec2 p) {
			vec2 i = floor(p);
			vec2 f = fract(p);
			vec2 u = f * f * (3.0 - 2.0 * f);
			float a = hash(i);
			float b = hash(i + vec2(1.0, 0.0));
			float c = hash(i + vec2(0.0, 1.0));
			float d = hash(i + vec2(1.0, 1.0));
			return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
		}

		float fbm(vec2 p) {
			float v = 0.0;
			float amp = 0.5;
			mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
			for (int i = 0; i < 5; i++) {
				v += amp * noise(p);
				p = m * p;
				amp *= 0.5;
			}
			return v;
		}

		void main() {
			vec2 uv = gl_FragCoord.xy / u_res;
			float aspect = u_res.x / u_res.y;
			vec2 p = uv * vec2(aspect, 1.0) * 1.6;
			vec2 m = u_mouse * vec2(aspect, 1.0) * 1.6;
			float t = u_time * 0.06;

			/* cursor stirs the ink: local swirl with gaussian falloff */
			vec2 d = p - m;
			float swirl = 1.2 * exp(-dot(d, d) * 5.0);
			p = m + mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl)) * d;

			/* domain-warped fbm — ink marbling */
			vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t * 0.8));
			vec2 r = vec2(
				fbm(p + 2.0 * q + vec2(1.7, 9.2) + 0.35 * t),
				fbm(p + 2.0 * q + vec2(8.3, 2.8) - 0.25 * t)
			);
			float f = fbm(p + 2.0 * r);

			/* push most area to pure black/white; grays live only in the flow bands,
			   otherwise difference-blended text lands on mid-gray and vanishes */
			float v = smoothstep(0.36, 0.64, f);
			gl_FragColor = vec4(vec3(v), 1.0);
		}
	`;

	onMount(() => {
		const gl = canvas.getContext('webgl', {
			alpha: false,
			depth: false,
			stencil: false,
			antialias: false,
			powerPreference: 'low-power'
		});
		if (!gl) return;

		function compile(type: number, src: string) {
			const s = gl!.createShader(type)!;
			gl!.shaderSource(s, src);
			gl!.compileShader(s);
			if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
				console.warn('liquid-bg shader:', gl!.getShaderInfoLog(s));
			}
			return s;
		}

		const program = gl.createProgram()!;
		gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
		gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.warn('liquid-bg link:', gl.getProgramInfoLog(program));
			return;
		}
		gl.useProgram(program);

		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const aPos = gl.getAttribLocation(program, 'a_pos');
		gl.enableVertexAttribArray(aPos);
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

		const uRes = gl.getUniformLocation(program, 'u_res');
		const uTime = gl.getUniformLocation(program, 'u_time');
		const uMouse = gl.getUniformLocation(program, 'u_mouse');

		/* gradients survive upscaling, so render at half resolution */
		const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.5;

		function resize() {
			canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
			canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
			gl!.viewport(0, 0, canvas.width, canvas.height);
		}
		resize();

		/* start the cursor far offscreen so the swirl is inert until first move */
		let targetX = -10;
		let targetY = -10;
		let mouseX = -10;
		let mouseY = -10;

		function onPointer(e: PointerEvent) {
			targetX = e.clientX / canvas.clientWidth;
			targetY = 1 - e.clientY / canvas.clientHeight;
		}

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
		let raf = 0;
		const start = performance.now();

		function draw(time: number) {
			gl!.uniform2f(uRes, canvas.width, canvas.height);
			gl!.uniform1f(uTime, time);
			gl!.uniform2f(uMouse, mouseX, mouseY);
			gl!.drawArrays(gl!.TRIANGLES, 0, 3);
		}

		function frame() {
			mouseX += (targetX - mouseX) * 0.06;
			mouseY += (targetY - mouseY) * 0.06;
			draw((performance.now() - start) / 1000);
			raf = requestAnimationFrame(frame);
		}

		function setRunning(run: boolean) {
			cancelAnimationFrame(raf);
			if (run) raf = requestAnimationFrame(frame);
			else draw((performance.now() - start) / 1000);
		}

		const shouldRun = () => !reduced.matches && !document.hidden;
		const onVisibility = () => setRunning(shouldRun());

		setRunning(shouldRun());
		window.addEventListener('resize', resize);
		window.addEventListener('pointermove', onPointer);
		document.addEventListener('visibilitychange', onVisibility);
		reduced.addEventListener('change', onVisibility);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
			window.removeEventListener('pointermove', onPointer);
			document.removeEventListener('visibilitychange', onVisibility);
			reduced.removeEventListener('change', onVisibility);
			gl.getExtension('WEBGL_lose_context')?.loseContext();
		};
	});
</script>

<canvas bind:this={canvas} class="liquid-bg" aria-hidden="true"></canvas>

<style>
	.liquid-bg {
		position: fixed;
		inset: 0;
		/* sits behind all content; body must stay transparent (html carries the
		   ink fallback) or its background paints over this negative-z layer */
		z-index: -1;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
</style>
