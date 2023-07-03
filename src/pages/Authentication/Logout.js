import React, { useEffect } from "react";
import PropTypes from "prop-types";
import withRouter from "components/Common/withRouter";
import { logoutUser } from "../../store/actions";
import AuthService from "../../services/Auth.service";

//redux
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  AuthService.logout();

  useEffect(() => {
    dispatch(logoutUser(history));
  }, [dispatch, history]);

  return <></>;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);