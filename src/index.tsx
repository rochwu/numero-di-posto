import {createRoot} from 'react-dom/client';
import {RecoilRoot} from 'recoil';

import {Provider} from 'react-redux';
import {store} from './state';

import App from './App';

const rootElement = document.getElementById('root');

const root = createRoot(rootElement!); // createRoot(container!) if you use TypeScript

root.render(
  <Provider store={store}>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </Provider>,
);
