import { useEffect, useRef } from 'react';

interface MathRendererProps {
  content: string;
  className?: string;
}

export function MathRenderer({ content, className = '' }: MathRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load MathJax script if not already loaded
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
      script.async = true;
      document.head.appendChild(script);

      const mathJaxScript = document.createElement('script');
      mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      mathJaxScript.async = true;
      document.head.appendChild(mathJaxScript);

      // Configure MathJax
      window.MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']]
        },
        options: {
          skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
        },
        startup: {
          ready: () => {
            console.log('MathJax is loaded and ready to go!');
            window.MathJax.startup.defaultReady();
          }
        }
      };
    }

    // Render math when content changes
    const renderMath = () => {
      if (window.MathJax && window.MathJax.typesetPromise && contentRef.current) {
        window.MathJax.typesetPromise([contentRef.current]).catch((err: any) => {
          console.error('MathJax rendering error:', err);
        });
      }
    };

    // If MathJax is already loaded, render immediately
    if (window.MathJax && window.MathJax.typesetPromise) {
      renderMath();
    } else {
      // Otherwise, wait for it to load
      const checkMathJax = setInterval(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
          clearInterval(checkMathJax);
          renderMath();
        }
      }, 100);

      return () => clearInterval(checkMathJax);
    }
  }, [content]);

  return (
    <div 
      ref={contentRef}
      className={`math-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

// Extend the Window interface to include MathJax
declare global {
  interface Window {
    MathJax: any;
  }
}