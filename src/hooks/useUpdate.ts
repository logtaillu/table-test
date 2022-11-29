import React, { useCallback, useState } from 'react'
export default function () {
    const [up, setUp] = useState({});
    const update = useCallback(() => {
        setUp({});
    }, []);
    return update;
}