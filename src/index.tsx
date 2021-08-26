import {render} from 'react-dom';
import {RecoilRoot} from 'recoil';

import {Provider} from 'react-redux';
import {store} from './state';

import App from './App';

const rootElement = document.getElementById('root');
render(
  <Provider store={store}>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </Provider>,
  rootElement,
);
