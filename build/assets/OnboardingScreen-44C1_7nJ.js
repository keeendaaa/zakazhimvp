import{r as a,j as e,A as l,m as r}from"./vendor-motion-Drb_rv-o.js";import"./vendor-react-D3F3s8fL.js";function g({onComplete:t}){const[s,n]=a.useState(!1),[o,i]=a.useState(!1),c=()=>{n(!0),localStorage.setItem("hasCompletedOnboarding","true"),localStorage.setItem("shouldOpenDishSelection","true"),setTimeout(()=>{i(!0),setTimeout(()=>{t()},500)},1e3)};return e.jsx(l,{children:!o&&e.jsxs(r.div,{className:"fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center",initial:{opacity:1},animate:{opacity:1},exit:{opacity:0},transition:{duration:.5},children:[e.jsxs("div",{className:"text-center px-6 max-w-md",children:[e.jsx("h1",{className:"text-3xl font-bold text-gray-900 mb-4",children:"Добро пожаловать!"}),e.jsx("p",{className:"text-gray-600 mb-12 text-lg",children:"Переключите ползунок, чтобы мы подсказали вам лучшее блюдо"}),e.jsxs("div",{className:"pancake-stack-toggle flex justify-center",children:[e.jsx("input",{type:"checkbox",id:"onboarding-toggle",checked:s,onChange:c}),e.jsx("label",{htmlFor:"onboarding-toggle",children:e.jsxs("div",{className:"pancakes",children:[e.jsx("div",{className:"pancake"}),e.jsx("div",{className:"pancake"}),e.jsx("div",{className:"pancake"}),e.jsx("div",{className:"butter"})]})})]})]}),e.jsx("style",{children:`
        .pancake-stack-toggle {
          position: relative;
          display: inline-block;
        }

        .pancake-stack-toggle input {
          height: 40px;
          left: 0;
          opacity: 0;
          position: absolute;
          top: 0;
          width: 40px;
          cursor: pointer;
        }

        .pancake-stack-toggle label {
          width: 7em;
          background: #2e394d;
          height: 3em;
          display: inline-block;
          border-radius: 50px;
          margin: 40px;
          position: relative;
          transition: all .3s ease;
          transform-origin: 20% center;
          cursor: pointer;
        }

        .pancake-stack-toggle label:before {
          content: none;
        }

        .pancake-stack-toggle .pancakes {
          transition: .6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .pancake-stack-toggle .pancake {
          background: #e27c31;
          border-radius: 50%;
          width: 2.5em;
          height: 2.5em;
          position: absolute;
          transition: .4s ease;
          top: 2px;
          left: 4px;
          box-shadow: 0 2px 0 2px #fbbe7c;
        }

        .pancake-stack-toggle .pancake:nth-child(2) {
          left: 0;
          top: -3px;
          transform: scale(0);
          transition: .2s ease .2s;
        }

        .pancake-stack-toggle .pancake:nth-child(3) {
          top: -8px;
          transform: scale(0);
          transition: .2s ease .2s;
        }

        .pancake-stack-toggle .pancake:nth-child(3):before,
        .pancake-stack-toggle .pancake:nth-child(3):after {
          content: '';
          background: #ef8927;
          border-radius: 20px;
          width: 50%;
          height: 20%;
          position: absolute;
        }

        .pancake-stack-toggle .pancake:nth-child(3):before {
          top: 20px;
          left: 5px;
        }

        .pancake-stack-toggle .pancake:nth-child(3):after {
          top: 22px;
          right: 5px;
        }

        .pancake-stack-toggle .butter {
          width: 12px;
          height: 11px;
          background: #fbdb60;
          top: 6px;
          left: 20px;
          position: absolute;
          border-radius: 4px;
          box-shadow: 0 1px 0 1px #d67823;
          transform: scale(0);
          transition: .2s ease;
        }

        .pancake-stack-toggle input:checked + label .pancakes {
          transform: translateX(70px);
        }

        .pancake-stack-toggle input:checked + label .pancake:nth-child(2) {
          transform: scale(1);
          transition-delay: .2s;
        }

        .pancake-stack-toggle input:checked + label .pancake:nth-child(3) {
          transform: scale(1);
          transition-delay: .4s;
        }

        .pancake-stack-toggle input:checked + label .butter {
          transform: scale(1);
          transition-delay: .6s;
        }
      `})]})})}export{g as default};
