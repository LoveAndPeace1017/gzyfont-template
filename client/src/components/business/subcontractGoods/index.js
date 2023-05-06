import * as actions from './actions';
import * as outActions from './outActions';
import reducer from './reducer';
import outReducer from './outReducer'
import withFillGoods from './views/withFillGoods';

export { actions, reducer, outActions, outReducer};

export default withFillGoods;
