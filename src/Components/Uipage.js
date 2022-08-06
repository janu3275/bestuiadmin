import React, { useEffect, useRef, useState } from "react";
import "./Uipage.css";
import axios from "axios";
import Datarow from "./Datarow";

const Uipage = () => {
  const [pageno, setPageNo] = useState(0);
  const [allchecked, setAllChecked] = useState(false);
  const [currentpagedata, setCurrentPageData] = useState([]);
  const [actionarr, setActionArr] = useState([]);
  const [alldata, setAllData] = useState([]);
  const [noofpages, setNoOfPages] = useState([]);
  const [searchdata, setSearchData] = useState([]);
  const actionArrref = useRef([]);
  const dataref = useRef(null);
  const currentPageDataref = useRef(null);
  const noOfPagesref = useRef(null);
  const searchref = useRef(null);

  useEffect(() => {
    if (searchref.current && searchref.current.split("").length > 0) {
      console.log("search again");
      searchfn(searchref.current);
    } else {
      getCurrentData(alldata);
    }

    setAllChecked(false);
  }, [pageno]);

  useEffect(() => {
    if (searchref.current && searchref.current.split("").length > 0) {
      console.log("search again");

      searchfn(searchref.current);
    } else {
      getCurrentData(alldata);
    }
  }, [alldata]);

  useEffect(() => {
    getCurrentData(searchdata);
  }, [searchdata]);

  useEffect(() => {
    if (!noofpages.includes(pageno)) {
      setPageNo(noofpages.length);
    } else {
      setPageNo(noofpages[0]);
    }
  }, [noofpages]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );

      dataref.current = res.data;
      setAllData(res.data);
      if (dataref.current !== null) {
        getCurrentData(alldata);
        getButtonsArr(dataref.current);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentData = (data) => {
    if (data.length === 0) {
      currentPageDataref.current = [];
      setCurrentPageData([]);
      return;
    }
    const arr = [];
    if (data.length >= pageno * 10) {
      for (let i = pageno * 10 - 10; i < pageno * 10; i++) {
        arr.push(data[i]);
      }
    } else {
      for (let i = pageno * 10 - 10; i < data.length; i++) {
        arr.push(data[i]);
      }
    }
    if (arr[0]) {
      currentPageDataref.current = arr;
      setCurrentPageData(arr);
    }
    if (data.length > 0) {
      const arr = [...data];
      dataref.current = arr;
    }
  };

  const getButtonsArr = (dref) => {
    if (noofpages.length !== Math.ceil(dref.length / 10)) {
      const noofpages = Math.ceil(dref.length / 10);

      const buttonarr = [];
      for (let i = 0; i < noofpages; i++) {
        buttonarr.push(i + 1);
      }

      noOfPagesref.current = buttonarr;
      setNoOfPages([...buttonarr]);
    }

    console.log(noOfPagesref.current);
    if (pageno === 0) {
      setPageNo(1);
    }
  };

  const allCheckedFn = (e) => {
    const arr = [];

    currentpagedata.forEach((x) => arr.push(x.id));

    if (e.target.checked) {
      setAllChecked(true);

      actionArrref.current = [...actionArrref.current, ...arr];
      actionArrref.current = [...new Set(actionArrref.current)];
      setActionArr(actionArrref.current);
    } else {
      actionArrref.current = actionArrref.current.filter(
        (x) => !arr.includes(x)
      );
      setAllChecked(false);
      setActionArr(actionArrref.current);
    }
  };

  const selectedfn = (e) => {
    if (!actionarr.includes(e.target.name)) {
      actionArrref.current.push(e.target.name);
      const arr = [...actionArrref.current];
      setActionArr(arr);
    } else {
      const arr = actionArrref.current.filter((x) => x !== e.target.name);
      actionArrref.current = [...arr];
      setActionArr(actionArrref.current);
    }
  };

  const nextPagefn = () => {
    if (pageno === noOfPagesref.current.length) {
      console.log("last page");
    } else {
      const nextpage = pageno + 1;
      setPageNo(nextpage);
    }
  };

  const previousPagefn = () => {
    if (pageno === 1) {
      console.log("first page");
    } else {
      const prevpage = pageno - 1;
      setPageNo(prevpage);
    }
  };

  const changeOriginalDatafn = (e, id) => {
    const arr = [...alldata];
    arr.forEach((x) => {
      if (x.id === id) {
        x[e.target.name] = e.target.value;
        setAllData(arr);
      }
    });
  };

  const deletefn = (e, id) => {
    const arr = [...alldata];
    const newarr = arr.filter((x) => x.id !== id);
    setAllData(newarr);
    dataref.current = newarr;

    getButtonsArr(dataref.current);
  };

  const allDeletefn = () => {
    const arr = [...alldata];
    const newarr = arr.filter((x) => !actionArrref.current.includes(x.id));
    setAllData(newarr);
    dataref.current = newarr;

    getButtonsArr(dataref.current);
    actionArrref.current = [];
    setActionArr([]);
    setAllChecked(false);
  };

  const searchfn = (e) => {
    const arr = [...alldata];
    let searchtarget = "";
    if (e.target) {
      searchtarget = e.target.value;
    } else {
      searchtarget = e;
    }
    searchref.current = searchtarget;
    const newarr = arr.filter(
      (x) =>
        x.name.includes(searchtarget) ||
        x.email.includes(searchtarget) ||
        x.role.includes(searchtarget)
    );

    setSearchData(newarr);
    getButtonsArr(newarr);
  };

  return (
    <div className="mainpage">
      <div className="searchrow">
        <input
          onChange={searchfn}
          className="searchbar"
          type="text"
          placeholder="Search"
        />
      </div>
      <div className="table">
        <div className="toprow">
          <input
            checked={allchecked}
            className="checkbox"
            onChange={allCheckedFn}
            type="checkbox"
          />
          <h4 className="title">Name</h4>
          <h4 className="title">Email</h4>
          <h4 className="title">Role</h4>
          <h4 className="title">Actions</h4>
        </div>
        {currentpagedata[0] ? (
          currentpagedata.map((x) => (
            <Datarow
              key={x.id}
              data={x}
              actArr={actionarr}
              selectfn={selectedfn}
              changeDatafn={changeOriginalDatafn}
              deletefun={deletefn}
            />
          ))
        ) : (
          <>No data left to show</>
        )}
      </div>
      <div className="alldelete">
        <button onClick={allDeletefn} className="alldeletebtn">
          Delete all
        </button>
      </div>
      {noOfPagesref.current && (
        <div className="buttonsrow">
          <button
            onClick={() => setPageNo(1)}
            className={pageno === noofpages[0] ? "disablebtn" : "pagebtns"}
          >
            F
          </button>
          <button
            onClick={previousPagefn}
            className={pageno === noofpages[0] ? "disablebtn" : "pagebtns"}
          >
            P
          </button>
          {noofpages.map((x) => (
            <button
              key={x}
              className={pageno === x ? "currentpagebtn" : "pagebtns"}
              onClick={() => setPageNo(x)}
            >
              {x}
            </button>
          ))}
          <button
            onClick={nextPagefn}
            className={
              pageno === noofpages[noofpages.length - 1]
                ? "disablebtn"
                : "pagebtns"
            }
          >
            N
          </button>
          <button
            onClick={() => setPageNo(noOfPagesref.current.length)}
            className={
              pageno === noofpages[noofpages.length - 1]
                ? "disablebtn"
                : "pagebtns"
            }
          >
            L
          </button>
        </div>
      )}
    </div>
  );
};

export default Uipage;
