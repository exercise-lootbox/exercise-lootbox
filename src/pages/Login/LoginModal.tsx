import { useState } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../Login/userReducer';

function LoginModal({ show, handleClose, authSucceeded, authFailed, }: {
  show: boolean;
  handleClose: () => void;
  authSucceeded: () => void;
  authFailed: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const dispatch = useDispatch();

  const handleReAuth = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const credential = EmailAuthProvider.credential(
          email,
          password
        );
        const newCredential = await reauthenticateWithCredential(currentUser, credential);
        dispatch(setAuthToken(await newCredential.user.getIdToken()));
        authSucceeded();
      }
    } catch (error: any) {
      console.error(error.message);
      authFailed();
    }
  }

  return (
    <div>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} dialogClassName="login-modal">
        <Modal.Header>
          <Modal.Title>Changing your email requires reauthentication</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="form-group mb-2">
              <label className="fw-bold" htmlFor="email">Email address</label>
              <input value={email} type="email" className="form-control" id="email" placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group mb-2">
              <label className="fw-bold" htmlFor="password">Password</label>
              <input value={password} type="password" className="form-control" id="password" placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="button secondary-button" onClick={handleClose}>
            Discard Edits
          </Button>
          <Button variant="button primary-button" onClick={handleReAuth}>
            Sign in
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LoginModal;