import React, {useEffect, useState} from 'react';
// import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

import './Chat.css'

let socket;

const Chat = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState('');

    const location = useLocation();
    const ENDPOINT = 'http://localhost:5000';
    
    useEffect(()=> {
        const params = new URLSearchParams(location.search);
        const name = params.get('name');
        const room = params.get('room');

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        // console.log(socket);

        socket.emit('join', {name, room}, () => {
            // console.log(name, room);
        });

        return () => {          // disconnect handle
            socket.emit('disconnect');
            socket.off();
        }
    },[ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })
        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, [messages, socket]);

    const sendMessage = (event) => {
        event.preventDefault();     // prevent refreshing
        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message, messages);

    return (
        <div className='outerContainer'>
            <div className='container'>
                <InfoBar room = {room}/>
                <Messages messages = {messages} name = {name}/>
                <Input message = {message} setMessage = {setMessage} sendMessage = {sendMessage}/>
                {/* <input 
                    value = {message}
                    onChange = {(event) => setMessage(event.target.value)}
                    onKeyPress = {event => event.key === 'Enter' ? sendMessage(event) : null}
                /> */}
            </div>
            <TextContainer users = {users}/>
        </div>
    );
}
export default Chat;