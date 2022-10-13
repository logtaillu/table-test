import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import TableDriver from '../tableDriver';
export default observer(function () {
    const [driver] = useState(() => new TableDriver());
    return (
        <div>ddd</div>
    )
});