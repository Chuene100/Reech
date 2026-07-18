import React, {useState} from "react";
import Calendar from "react-calendar";
import Card from "@/components/ui/Card";
// import 'react-calendar/dist/Calendar.css';

const MiniCalendar = () => {
    const [value, onChange] = useState(new Date())

    return (
        <div>
            <Calendar
                onChange={onChange}
                value={value}
                prevLabel={<i className="iconly-Arrow-Left-2 icli"></i>}
                nextLabel={<i className="iconly-Arrow-Right-2 icli"></i>}
                view={"month"}
            /> 
        </div>
    )
}

export default MiniCalendar;
