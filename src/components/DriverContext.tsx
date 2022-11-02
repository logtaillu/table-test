import { createContext, useContext } from "react"
import TableDriver from "../tableDriver/TableDriver";
export const DriverContext = createContext<TableDriver>(null as any);
export function useDriver(){
    const driver = useContext(DriverContext);
    return driver;
}