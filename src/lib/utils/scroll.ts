export interface ScrollOptions {  
  threshold?: number;  
  root?: HTMLElement;  
  onSectionChange?: (index: number) => void;  
}  
  
export function createScrollObserver(  
  sections: HTMLElement[],   
  options: ScrollOptions = {}  
): IntersectionObserver {  
  const { threshold = 0.6, root, onSectionChange } = options;  
    
  return new IntersectionObserver(  
    (entries) => {  
      entries.forEach((entry) => {  
        if (entry.isIntersecting && onSectionChange) {  
          const index = sections.indexOf(entry.target as HTMLElement);  
          onSectionChange(index);  
        }  
      });  
    },  
    { root, threshold }  
  );  
}  
  
export function detectSections(container: HTMLElement): HTMLElement[] {  
  return Array.from(container.querySelectorAll<HTMLElement>("section"));  
}