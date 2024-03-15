import React, { useState } from 'react';
import Navbar from '/partials/nav.jsx'; // Import the Navbar component and provide the correct path
import { Helmet } from 'react-helmet';
import '../Public/dashboard/dashboard';
// import '../Public/dashboard/dashboard.css';

const dashboard = ({ user, expenses }) => {
    const [date, setDate] = useState('');

    const handleChange = (event) => {
        // Handle changes in the form inputs
        // You can add your logic here if needed
    };

    return (
        <html>

            <Helmet>
                <link rel="icon" type="image/png" href="/landing_page/rupee.png" />
                <title>MoneyMinder-Dashboard</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&family=Jost&family=Lato&family=Montserrat:wght@300;400&display=swap" rel="stylesheet" />
            </Helmet>

            <body>
                {/* Nav Bar */}
                <Navbar user={user} />

                {/* Dashboard heading */}
                <div className="head container">
                    <h1 className="responsive-h1">Hello {user}</h1>
                    <h3>Welcome to your Dashboard</h3>
                </div>

                {/* Dashboard user input form */}
                <div className="second">
                    <h2 className="cent">Add or Delete your expenses here</h2>
                    <div>
                        <form action={`/${user}/dashboard/add`} method="post" className="inp-form" id="inp-form">
                            <label htmlFor="date">Date:</label>
                            <input type="date" id="date" name="date" required />
                            <label htmlFor="item">Item:</label>
                            <input type="text" name="title" onChange={handleChange} placeholder="Add item" required />
                            <label htmlFor="amount">Amount:</label>
                            <input type="text" name="amount" placeholder="Amount in Rs" rows="1" required />
                            <label htmlFor="category">Category:</label>
                            <select name="category" required>
                                <option value="" disabled selected>Select an option</option>
                                <option value="Food">Food</option>
                                <option value="Housing">Housing</option>
                                {/* Add more options for categories */}
                            </select>
                            <button type="submit" className="inp-but">+</button>
                        </form>
                    </div>

                    {/* Dashboard card notes */}
                    <div className="scrolling-wrapper">
                        {expenses.reverse().map((expenseItem) => (
                            <section key={expenseItem._id} className="my-5" style={{ maxWidth: '13rem' }}>
                                <form action={`/${user}/dashboard/delete`} method="post" className="del-form" data-id={expenseItem._id}>
                                    <input type="hidden" name="expenseId" value={expenseItem._id} />
                                    <div className="card">
                                        <div className="card-body">
                                            <blockquote className="blockquote blockquote-custom bg-white px-3 pt-4">
                                                <div className="blockquote-custom-icon shadow-1-strong">
                                                    {expenseItem.date.toLocaleDateString("en-GB")}
                                                </div>
                                                <p className="card_p">
                                                    {expenseItem.description}
                                                </p>
                                                <div className="pt-2 mt-2 border-top">
                                                    <p className="card_p">
                                                        Rs {expenseItem.Amount}
                                                    </p>
                                                </div>
                                            </blockquote>
                                        </div>
                                        <button type="submit" className="del-but">-</button>
                                    </div>
                                </form>
                            </section>
                        ))}
                    </div>
                </div>

                {/* Dashboard expense history */}
                <div className="container-fluid third" style={{ backgroundColor: '#401c64', paddingTop: '50px', paddingBottom: '75px' }}>
                    <h2 className="cent">Your expense history</h2>
                    <div class="container">
                        <form class="hist-form">
                            <div class="form-group hide_or_not">
                                <label for="date-input">Date:</label>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text desktop-only" onclick="decrementDate()">&#x25C0;</span>
                                    </div>
                                    <input type="date" class="form-control" id="date-input" name="date_input" />
                                    <div class="input-group-append">
                                        <span class="input-group-text desktop-only" onclick="incrementDate()">&#x25B6;</span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="sort-select">Sort By:</label>
                                <select class="form-control" id="sort-select" name="sort_select" required>
                                    <option value="" disabled selected>Select an option</option>
                                    <option value="any">Any</option>
                                    <option value="amount_asc">Amount Ascending</option>
                                    <option value="amount_dec">Amount Decending</option>
                                    <option value="category">Category</option>
                                    <option value="date_asc">Date Ascending</option>
                                    <option value="date_dec">Date Decending</option>

                                </select>


                            </div>
                            <div style="text-align:center;" class="form-group">
                                <button style="margin-bottom:20px;margin-top:10px;" class="mid_button" type="submit" name="show_all" value="true">Apply filter</button><br />

                            </div>

                        </form>
                        <div style="text-align:center;" id="no_element" class="hidden">
                            <h2 style="text-align:center" id="no-elements-message"></h2>
                            <button class="mid_button" type="submit">Show all</button>
                        </div>
                    </div>

                    <div className="container table-responsive">
                        <table id="data-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Amount in Rs</th>
                                    <th>Date</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.length > 0 ? (
                                    expenses.map((expense) => (
                                        <tr key={expense._id}>
                                            <td>{expense.description}</td>
                                            <td>{expense.Amount}</td>
                                            <td>{expense.date ? expense.date.toLocaleDateString('zh-Hans-CN') : ''}</td>
                                            <td>{expense.category}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No expenses found for the selected date</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>



                </div>

                {/* Links to other pages */}
                <div className="forth">
                    <a href={`/${user}/insights`}><button style={{ marginBottom: '10px' }} type="button" className="btn dash_link">Smart Insights</button></a><br /><br />
                    <a href={`/${user}/loans`}><button style={{ marginBottom: '10px' }} type="button" className="btn dash_link">Track Loans</button></a>
                </div>
                <Helmet>
                    <script src="https://kit.fontawesome.com/1465e7da9e.js" crossOrigin="anonymous"></script>
                </Helmet>

            </body>

        </html >
    );
};

export default dashboard;
