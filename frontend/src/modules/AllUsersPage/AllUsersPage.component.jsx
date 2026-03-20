import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getUsers } from "../../redux/users/users.actions";
import handleSorting from "../../utils/handleSorting";

import UserPanel from "./UserPanel/UserPanel.component";
import Spinner from "../../components/molecules/Spinner/Spinner.component";
import SearchBox from "../../components/molecules/SearchBox/SearchBox.component";
import ButtonGroup from "../../components/molecules/ButtonGroup/ButtonGroup.component";
import Pagination from "../../components/organisms/Pagination/Pagination.component";

import "./AllUsersPage.styles.scss";

const itemsPerPage = 18;

const AllUsersPage = ({
  getUsers,
  user: { users, loading },
  title = "Users",
  allowedUsernames = null,
}) => {
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const [page, setPage] = useState(1);
  const [fetchSearch, setSearch] = useState("");
  const [sortType, setSortType] = useState("Popular");

  const usersList = Array.isArray(users) ? users : [];
  const visibleUsers = Array.isArray(allowedUsernames)
    ? usersList.filter((user) => allowedUsernames.includes(user.username))
    : usersList;
  const filteredUsers = visibleUsers.filter((user) =>
    user.username.toLowerCase().includes(fetchSearch.toLowerCase())
  );

  const handlePaginationChange = (e, value) => setPage(value);

  const handleChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
    setPage(1);
  };

  return loading || users === null ? (
    <Spinner type="page" width="75px" height="200px" />
  ) : (
    <>
      <div id="mainbar" className="users-page fc-black-800">
        <h1 className="headline">{title}</h1>
        <div className="users-tabs">
          <SearchBox
            placeholder={"filter by user"}
            handleChange={handleChange}
            width={"200px"}
          />
          <div className="right-side-tools">
            <span className="item-count">
              {new Intl.NumberFormat("en-IN").format(filteredUsers.length)} users
            </span>
            <ButtonGroup
              buttons={["Popular", "Name", "Active", "New Users"]}
              selected={sortType}
              setSelected={setSortType}
            />
          </div>
        </div>
        <div className="user-browser">
          <div className="grid-layout">
            {filteredUsers
              ?.sort(handleSorting(sortType, "users"))
              .slice(
                (page - 1) * itemsPerPage,
                (page - 1) * itemsPerPage + itemsPerPage
              )
              .map((user, index) => (
                <UserPanel key={index} user={user} />
              ))}
          </div>
        </div>
        <Pagination
          page={page}
          itemList={filteredUsers}
          itemsPerPage={itemsPerPage}
          handlePaginationChange={handlePaginationChange}
        />
      </div>
    </>
  );
};

AllUsersPage.propTypes = {
  getUsers: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  title: PropTypes.string,
  allowedUsernames: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { getUsers })(AllUsersPage);
