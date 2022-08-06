import React, { useState } from "react";

const Datarow = ({ data, actArr, selectfn, changeDatafn, deletefun }) => {
  const [editstate, setEditState] = useState(true);

  const editfn = () => {
    setEditState(!editstate);
  };

  return (
    <div className={actArr.includes(data.id) ? "selectedrow" : "datarows"}>
      <input
        onChange={selectfn}
        checked={actArr.includes(data.id)}
        name={data.id}
        className="checkbox"
        type="checkbox"
      />
      {editstate ? (
        <p className="title">{data.name}</p>
      ) : (
        <input
          className="title"
          name="name"
          onChange={(e) => changeDatafn(e, data.id)}
          value={data.name}
        />
      )}
      {editstate ? (
        <p className="title">{data.email}</p>
      ) : (
        <input
          className="title"
          name="email"
          onChange={(e) => changeDatafn(e, data.id)}
          value={data.email}
        />
      )}
      {editstate ? (
        <p className="title">{data.role}</p>
      ) : (
        <input
          className="title"
          name="role"
          onChange={(e) => changeDatafn(e, data.id)}
          value={data.role}
        />
      )}
      <div className="title">
        <button onClick={editfn} className="actionbtne">
          E
        </button>
        <button onClick={(e) => deletefun(e, data.id)} className="actionbtnd">
          D
        </button>
      </div>
    </div>
  );
};

export default Datarow;
