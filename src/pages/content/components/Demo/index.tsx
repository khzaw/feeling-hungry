import { createRoot } from "react-dom/client";
import reactDOM from 'react-dom';
import App from "@src/pages/content/components/Demo/app";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import fpDesignTokens from '@deliveryhero/pd-bento-design-tokens/web/js/fp'; // Brand you want to import

console.log('body: ', document.body);

if (document.body) {
    Object.keys(fpDesignTokens).forEach(colorKey => {
        document.body.style.setProperty(`--${colorKey}`, fpDesignTokens[colorKey]);
    });
}

refreshOnUpdate("pages/content");

const root = document.createElement("div");
root.id = "chrome-extension-boilerplate-react-vite-content-view-root";
document.body.append(root);


const formButtonContainer = document.getElementsByClassName('button-container')[0]
// formButtonContainer.setAttribute('id', 'form-container')
// const formContainer = document.getElementById('form-container'); // Global parent
formButtonContainer.classList.remove('two-buttons');
formButtonContainer.classList.add('three-buttons');

const orSpan = document.createElement('span');
orSpan.classList.add('button-text-separator');
orSpan.textContent = 'or';
formButtonContainer.appendChild(orSpan);

const buttonDiv = document.createElement('div');
buttonDiv.classList.add('surprise-me-button');
formButtonContainer.appendChild(buttonDiv);

// console.log('formContainer', formContainer);
// if (formContainer) {
//     Object.keys(fpDesignTokens).forEach(colorKey => {
//         formContainer.style.setProperty(`--${colorKey}`, fpDesignTokens[colorKey]);
//     });
// }


function injectScript() {
    const script = document.createElement('script');
    script.textContent = `
      window.global = window;
  `;
    document.documentElement.appendChild(script);
}
injectScript();

createRoot(root).render(<App />);
reactDOM.render(<App />, buttonDiv);
