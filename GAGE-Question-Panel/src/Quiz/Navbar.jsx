import React from 'react';
import {Link} from "react-router-dom";

const Navbar = ({eid}) => {
    return (
        <div className=" container d-flex justify-content-start align-items-center pt-2 mr-3">
            <Link
                to={`/?gamecode=${eid}`}
                className="btn btn-secondary me-2"
            >
                Main
            </Link>
            <Link
                to={`/checkReports/${eid}/?gamecode=${eid}`}
                className="btn btn-secondary me-2"
            >
                Chart
            </Link>
            <Link
                to={`/answers/${eid}/?gamecode=${eid}`}
                className="btn btn-success me-2"
            >
                Questions
            </Link>
            <Link
                to={`/reportcard/${eid}/?gamecode=${eid}`}
                className="btn btn-primary me-2"
            >
                Percentage
            </Link>
            <Link
                to={`/votingReports/${eid}/?gamecode=${eid}`}
                className="btn btn-warning me-2 text-white"
            >
                Voting
            </Link>
        </div>
    );
};

export default Navbar;