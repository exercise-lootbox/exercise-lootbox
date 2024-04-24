import Form from 'react-bootstrap/Form';
import { useSelector, useDispatch } from 'react-redux';
import { setActingAsAdmin } from '../pages/Login/userReducer';
import "../css/admin.css"

function AdminToggle() {
  const adminId = useSelector((state: any) => state.persistedReducer.adminId);
  const actingAsAdmin = useSelector((state: any) => state.persistedReducer.actingAsAdmin);
  const dispatch = useDispatch();

  if (adminId === undefined) {
    return <></>
  }

  return <Form.Switch
    type="switch"
    className="admin-switch"
    id="admin-switch"
    label="Admin Mode"
    checked={actingAsAdmin}
    onChange={() => dispatch(setActingAsAdmin(!actingAsAdmin))}
  />

}

export default AdminToggle;
