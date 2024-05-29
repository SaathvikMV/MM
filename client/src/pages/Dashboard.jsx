import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import LoadingPage from "../components/Loading";
import NotAuth from "../components/NotAuth";
import Loader from "react-dots-loader";
import "react-dots-loader/index.css";

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [show, setShow] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [expenses, setExpenses] = useState([]);
  const [items, setItems] = useState([]);
  const [user, setUser] = useState("");
  const [AuthUser, setAuthUser] = useState(false);
  const [Loading, setLoading] = useState(true);
  const [CardsLoading, setCardsLoading] = useState(false);
  const [CategoriesLoading, setCategoriesLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    amount: 0,
    category: "",
    payment_method: "",
  });

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const applyFilter = (event) => {
    event.preventDefault();

    // console.log("Selected Date :", selectedDate);

    // Filter expenses based on the selected date
    const filtered = expenses.filter(
      (expense) => expense.date.split("T")[0] === selectedDate
    );

    setFilteredExpenses(filtered);
    setShow(true);
  };

  const getAll = (event) => {
    event.preventDefault();
    setShow(false);
  };

  const [sortBy, setSortBy] = useState({
    column: "Item", // default sorting column
    order: "asc", // default sorting order
  });

  const sortTable = (column) => {
    setSortBy((prevSortBy) => ({
      column,
      order:
        prevSortBy.column === column && prevSortBy.order === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    const aValue = a[sortBy.column];
    const bValue = b[sortBy.column];

    if (sortBy.order === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return bValue > aValue ? 1 : -1;
    }
  });

  const renderSortArrow = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "";
  };

  function handleChange(e) {
    const { name, value } = e.target;

    // Update the formData based on the input name
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const f_loadScript = async () => {
    const loadScript = (src, callback) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;

      script.onload = callback;

      document.body.appendChild(script);
    };

    // loadScript("/js/jquery.min.js", () => {
    //   loadScript("/js/popper.js", () => {
    //     loadScript("/js/bootstrap.min.js", () => {
    //       loadScript("/dashboard/dashboard.js", () => {
    //         // All scripts are loaded
    //         setScriptsLoaded(true);
    //       });
    //     });
    //   });
    // });
  };
  const handleFetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // console.log(token);
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(
          `http://localhost:5000/:user/dashboard/`,
          {
            headers,
          }
        );
        // console.log(response.data);
        setExpenses(response.data.expenses);
        setItems(response.data.items);
        // console.log(response.data.user);

        setUser(response.data.user);
        setLoading(false);
        setAuthUser(true);
      } else {
        setLoading(false);
        console.error("Token not found");
        setAuthUser(false);
        // Handle the case where the token is not available or not valid
      }
    } catch (error) {
      setLoading(false);
      setAuthUser(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  const handleOptionClick = (option) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: option,
    }));
    setSelectedOption(option);
    setCustomInput("");
  };

  // const handleCustomInputChange = (event) => {
  //   setCustomInput(event.target.value);
  //   setSelectedOption("");
  // };

  async function handleSubmit(e) {
    e.preventDefault();
    setCardsLoading(true);

    try {
      const token = localStorage.getItem("token");
      // console.log(token);
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const res = await axios.post(
          `http://localhost:5000/${user}/dashboard/add`,
          {
            date: formData.date,
            title: formData.title,
            amount: formData.amount,
            category: formData.category,
            payment_method: formData.payment_method,
          },
          {
            headers,
          }
        );
        setCardsLoading(false);
        // console.log(res);

        if (res.data && res.data.error) {
          toast.error(res.data.error, {
            duration: 3000,
            position: "bottom-right",
          });
        } else if (res.data) {
          handleFetchData();
          toast.success(res.data.message, {
            duration: 3000,
            position: "bottom-right",
          });
        }
      } else {
        console.log("Token not available!!");
      }
    } catch (e) {
      setLoading(false);
      // console.log(e);
      toast.error("An unexpected error occured", {
        duration: 3000,
        position: "bottom-right",
      });
    }
  }

  async function fetchCategories() {
    // e.preventDefault();
    setCategoriesLoading(true);

    try {
      const token = localStorage.getItem("token");
      // console.log(token);
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const res = await axios.post(
          `http://localhost:5000/:user/dashboard/categorise`,
          {
            item: formData.title,
          },
          {
            headers,
          }
        );
        if ((res.status = 200)) {
          setOptions(JSON.parse(res.data.predictions.replace(/'/g, '"')));
        }
        setCategoriesLoading(false);
        // console.log(res);

        if (res.data && res.data.error) {
          toast.error(res.data.error, {
            duration: 3000,
            position: "bottom-right",
          });
        }
      } else {
        console.log("Token not available!!");
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
      toast.error("An unexpected error occured", {
        duration: 3000,
        position: "bottom-right",
      });
    }
  }

  async function handleDeleteSubmit(e, expenseID) {
    e.preventDefault();
    setCardsLoading(true);

    try {
      const token = localStorage.getItem("token");
      console.log(token);
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const res = await axios.post(
          `http://localhost:5000/${user}/dashboard/delete`,
          {
            expenseId: expenseID,
          },
          {
            headers,
          }
        );
        setCardsLoading(false);
        // console.log(res);

        if (res.data && res.data.error) {
          toast.error(res.data.error, {
            duration: 3000,
            position: "bottom-right",
          });
        } else if (res.data) {
          handleFetchData();

          toast.success(res.data.message, {
            duration: 3000,
            position: "bottom-right",
          });
        }
      } else {
        console.log("Token not available!!");
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
      toast.error("An unexpected error occured", {
        duration: 3000,
        position: "bottom-right",
      });
    }
  }

  const incrementDate = () => {
    const dateInput = document.getElementById("date-input");
    const currentDate = new Date(dateInput.value);
    const nextDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const today = new Date();
    if (nextDate > today) {
      toast.error("Invalid Date!", {
        duration: 3000,
        position: "top-right",
      });
      return;
    }
    setSelectedDate(nextDate.toISOString().split("T")[0]);
    dateInput.value = nextDate.toISOString().split("T")[0];
  };

  const decrementDate = () => {
    const dateInput = document.getElementById("date-input");
    const currentDate = new Date(dateInput.value);
    const prevDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    setSelectedDate(prevDate.toISOString().split("T")[0]);
    dateInput.value = prevDate.toISOString().split("T")[0];
  };

  if (Loading === true && AuthUser === true) {
    return <LoadingPage />;
  } else if (AuthUser === false && Loading === false) {
    return <NotAuth />;
  } else if (AuthUser === true && Loading === false) {
    f_loadScript();
    return (
      <>
        <Toaster />
        <link rel="icon" type="image/png" href="/landing_page/rupee.png" />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        />
        <link rel="stylesheet" href="/dashboard/dashboard.css" />

        <Navbar user={user} />

        <div className="head container">
          <h1 className="responsive-h1">Hello {user}</h1>
          <h3>Welcome to your Dashboard</h3>
        </div>

        <div className="second">
          {/* Dashboard user input form */}
          <h2 className="cent">Add or Delete your expenses here</h2>
          <div>
            <form onSubmit={handleSubmit} className="inp-form" id="inp-form">
              <label htmlFor="item">Item:</label>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                onBlur={formData.title !== "" && fetchCategories}
                value={formData.title}
                placeholder="Add item"
                required
              />
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                onChange={handleChange}
                value={formData.date}
                max={new Date().toISOString().split("T")[0]}
                required
              />
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                min={"1"}
                name="amount"
                value={formData.amount}
                placeholder="Amount in Rs"
                rows="1"
                onChange={handleChange}
                required
              />

              <label htmlFor="payment_method">Payment Method:</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                required
              >
                <option value="" disabled defaultValue>
                  Select an option
                </option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="CC">Credit Card</option>
                <option value="DC">Debit Card</option>
              </select>
              <label htmlFor="category">Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled defaultValue>
                  Select an option
                </option>
                <option value="Food">Food</option>
                <option value="Housing">Housing</option>
                <option value="Health">Health</option>
                <option value="Personal and Health Care">
                  Personal and Health Care
                </option>
                <option value="Entertainment">Entertainment</option>
                <option value="Savings">Savings</option>
                <option value="Travel">Travel</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
              <div
                style={{
                  width: "full",
                  display: "flex",
                  justifyContent: "center",
                  margin: "10px 0",
                }}
              >
                {CategoriesLoading ? (
                  <Loader size={10} color={"purple"} />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      width: "full",
                    }}
                  >
                    {options.map((option, index) => (
                      <div
                        style={{
                          color: "white",
                          padding: "8px 16px",
                          border: "1px solid #663e93",
                          borderRadius: "8px",
                          margin: "0 6px",
                          cursor: "pointer",
                          backgroundColor: "#663e93",
                        }}
                        key={index}
                        onClick={() => handleOptionClick(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="inp-but">
                +
              </button>
            </form>
          </div>

          {/* dashboard card notes */}
          <div className="scrolling-wrapper">
            {expenses.reverse().map((expenseItem) => (
              <section
                key={expenseItem._id}
                className="my-5"
                style={{ maxWidth: "13rem" }}
              >
                <form
                  onSubmit={(e) => handleDeleteSubmit(e, expenseItem._id)}
                  className="del-form"
                  data-id={expenseItem._id}
                >
                  <input
                    type="hidden"
                    name="expenseId"
                    value={expenseItem._id}
                  />
                  <div className="card">
                    <div className="card-body">
                      <blockquote className="blockquote blockquote-custom bg-white px-3 pt-4">
                        <div className="blockquote-custom-icon shadow-1-strong">
                          {new Date(expenseItem.date).toLocaleDateString(
                            "en-GB"
                          )}
                        </div>
                        <p className="card_p">{expenseItem.description}</p>
                        <div className="pt-2 mt-2 border-top">
                          <p className="card_p">Rs {expenseItem.Amount}</p>
                        </div>
                        <div className="pt-2 mt-2 border-top">
                          <p className="card_p">{expenseItem.payment_method}</p>
                        </div>
                      </blockquote>
                    </div>
                    <button type="submit" className="del-but">
                      -
                    </button>
                  </div>
                </form>
              </section>
            ))}
          </div>
        </div>

        <div
          className="container-fluid third"
          style={{
            backgroundColor: "#401c64",
            paddingTop: "50px",
            paddingBottom: "75px",
          }}
        >
          <h2 className="cent">Your expense history</h2>
          <div className="container">
            <form className="hist-form">
              <div className="form-group hide_or_not">
                <label htmlFor="date-input">Date:</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text desktop-only"
                      onClick={decrementDate}
                    >
                      &#x25C0;
                    </span>
                  </div>
                  <input
                    type="date"
                    className="form-control"
                    id="date-input"
                    name="date_input"
                    value={selectedDate}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={handleDateChange}
                  />
                  <div className="input-group-append">
                    <span
                      className="input-group-text desktop-only"
                      onClick={incrementDate}
                    >
                      &#x25B6;
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "center" }} className="form-group">
                <button
                  style={{ marginBottom: "20px", marginTop: "10px" }}
                  className="mid_button"
                  type="button"
                  name="show_all"
                  value="true"
                  onClick={applyFilter}
                >
                  Apply filter
                </button>
                <br />
              </div>
            </form>
          </div>

          <div className="container table-responsive">
            <div id="tablediv">
              <table id="data-table">
                <thead>
                  <tr id="table-data">
                    <th
                      onClick={() => sortTable("description")}
                      className={
                        sortBy.column === "description" ? sortBy.order : ""
                      }
                    >
                      Item {renderSortArrow("description")}
                    </th>
                    <th
                      onClick={() => sortTable("Amount")}
                      className={sortBy.column === "Amount" ? sortBy.order : ""}
                    >
                      Amount in Rs {renderSortArrow("Amount")}
                    </th>
                    <th
                      onClick={() => sortTable("date")}
                      className={sortBy.column === "date" ? sortBy.order : ""}
                    >
                      Date {renderSortArrow("date")}
                    </th>
                    <th
                      onClick={() => sortTable("category")}
                      className={
                        sortBy.column === "category" ? sortBy.order : ""
                      }
                    >
                      Category {renderSortArrow("category")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {show ? (
                    <>
                      {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense) => (
                          <tr key={expense._id}>
                            <td>{expense.description}</td>
                            <td>{expense.Amount}</td>
                            <td>
                              {expense.date
                                ? new Date(expense.date).toLocaleDateString(
                                    "en-IN"
                                  )
                                : ""}
                            </td>
                            <td>{expense.category}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">
                            No expenses found for the selected date
                          </td>
                        </tr>
                      )}
                    </>
                  ) : (
                    <>
                      {sortedExpenses.length > 0 ? (
                        sortedExpenses.map((expense) => (
                          <tr key={expense._id}>
                            <td>{expense.description}</td>
                            <td>{expense.Amount}</td>
                            <td>
                              {expense.date
                                ? new Date(expense.date).toLocaleDateString(
                                    "en-IN"
                                  )
                                : ""}
                            </td>
                            <td>{expense.category}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">
                            No expenses found for the selected date
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <div
              style={{ textAlign: "center", marginTop: "20px" }}
              id="no_element"
              onClick={getAll}
            >
              <h2 style={{ textAlign: "center" }} id="no-elements-message"></h2>
              <button className="mid_button" type="submit">
                Show all
              </button>
            </div>
          </div>
        </div>

        {/* links to other pages */}
        {/* <div className="forth">
          <a href={`/${user}/insights`}>
            <button
              style={{ marginBottom: "10px" }}
              type="button"
              className="btn dash_link"
            >
              Smart Insights
            </button>
          </a>
          <br />
          <br />
          <a href={`/${user}/loans`}>
            <button
              style={{ marginBottom: "10px" }}
              type="button"
              className="btn dash_link"
            >
              Track Loans
            </button>
          </a>
        </div> */}

        <script
          src="https://kit.fontawesome.com/1465e7da9e.js"
          crossOrigin="anonymous"
        ></script>
      </>
    );
  }
}

export default Dashboard;
