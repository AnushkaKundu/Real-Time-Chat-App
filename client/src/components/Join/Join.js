import React, {useState} from 'react';
import './Join.css'
import { useNavigate } from 'react-router-dom';
const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const navigate = useNavigate();
    const handleSubmit = () => {
        navigate(`/chat?name=${name}&room=${room}`);
    };
    return (
        <div className = "joinOuterContainer">
            <div className = "joinInnerContainer">
                <h1 className='heading'>Join</h1>
                <div>
                    <input placeholder='Name' className='joinInput' type='text' onChange={(event) => setName(event.target.value)} ></input>
                </div>
                <div>
                    <input placeholder='Room' className='joinInput mt-20' type='text' onChange={(event) => setRoom(event.target.value)} ></input>
                </div>
                {/* passing data using url, instead of props. */}
                {/* <Link onClick={event => (!name || !room) ? event.preventDefault() : null } to = {`/chat?name=${name}&room=${room}`}>
                    <button className='button mt-20' type='submit'>Sign In</button>
                </Link> */}
                <button className='button mt-20' onClick={handleSubmit }>Sign In</button>
            </div>
        </div>

    )
};
export default Join;