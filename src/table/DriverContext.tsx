import { createContext, useContext } from "react"
import EvDriver from "../driver/EvDriver";
export const DriverContext = createContext<EvDriver>(null as any);
export function useDriver(){
    const driver = useContext(DriverContext);
    return driver;
}