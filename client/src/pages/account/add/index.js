import * as actions from './actions';
import reducer from './reducer';
import AccountAdd from './views/add';
import AccountEdit from './views/edit';
import AccountMainForm from './views/mainForm';

export { actions, reducer };

export default {
    AccountAdd,
    AccountEdit,
    AccountMainForm
};
