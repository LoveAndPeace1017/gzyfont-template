import * as actions from './actions';
import reducer from './reducer';
import view, {create as oldFormCreate} from './views';
import newAddForm, {create as formCreate} from './views/newAddForm';

export { actions, reducer, newAddForm, oldFormCreate, formCreate };

export default view;
