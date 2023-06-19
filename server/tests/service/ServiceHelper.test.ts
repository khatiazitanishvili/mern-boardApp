import { dateToString } from "../../src/services/ServiceHelper";

test("dateToString", ()=>{
    const date = new Date();
    date.setFullYear(2042);
    date.setMonth(3); // month 0 to 11, i.e. 3 is April
    date.setDate(1); // day of month
    const str = dateToString(date);
    expect(str).toBe("1.4.2042");
})