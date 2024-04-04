import React, {useState, useEffect} from 'react'
import {db} from '../firebase/firebase'
import { useAuth } from '../authContexts'
import {doSignOut} from '../firebase/auth';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ExpenseModal from './expense_modal';
import './home.css';
import {collection, getDocs} from "firebase/firestore";
import { Link } from 'react-router-dom';


const Home = () => {
    const { currentUser } = useAuth();

    const [youOwed, setYouOwed] = useState([]);
    const [youAreOwed, setYouAreOwed] = useState([])
    const [selectedStory, setSelectedStory] = useState({})
    const [showSelectedStory, setShowSelectedStoty] = useState(false);
    const [showAddExpense, setShowAddExpense] = useState(false);

    const getData = async () => {
        const newYouOwed = [];
        const newyouAreOwed = [];

        const datadb = await getDocs(collection(db, "transactions"))
        datadb.docs.forEach(val => {
            const data = val.data()
            if(data.payer !== currentUser.email) {
                newYouOwed.push(data)
            } else {
                newyouAreOwed.push(data)
            }
        })
        setYouOwed(newYouOwed);
        setYouAreOwed(newyouAreOwed);
    }

    useEffect(() => {
        // get liabilities list
        getData()

    }, [showAddExpense])


    const getParticipants = (story) => {
        if(!story) {
            return [];
        }
        let participant = story?.participants || {};
        let participants = []
        for (let part of Object.keys(participant)) {
            if(part !== story.payer){
                participants.push(part)
            }
        }
        return participants;
    }

    let storyDescription = selectedStory?.description || "";
    let storyDate = selectedStory?.date || "";
    let paid = (selectedStory?.participants && selectedStory?.participants[selectedStory?.payer]) || "";
    let lent = getParticipants(selectedStory).length !== 0 && selectedStory.participants[getParticipants(selectedStory)[0]];
    let payer = `${selectedStory.payer === currentUser.email ?  "You" : selectedStory.payer} paid`;
    let lenter = getParticipants(selectedStory).length !== 0 && `${selectedStory.payer === currentUser.email ? "You" : selectedStory.payer } lent ${getParticipants(selectedStory)[0]}`;


    return (
        <>
            <Link to={'/login'} onClick={doSignOut}>Logout</Link>
            <div className="dashboard-container">
                <div className="title">
                    <h4>Dashboard</h4>
                </div>
                <div>
                    Welcome to Splitwise!
                </div>
                <p>
                    Splitwise helps you split bills with friends.
                    <br />
                    Click “Add an expense” below to get started!
                </p>
                <Button variant="primary" onClick={() => setShowAddExpense(true)}>
                    Add an expense
                </Button>
                <ExpenseModal
                    onCloseModal={() => setShowAddExpense(false)}
                    showAddExpense={showAddExpense}
                    setShowAddExpense={() => {
                        setShowAddExpense(false)
                    }
                    }

                    />
            </div>
            <div className="liabalities-container">
                {youOwed.length > 0 ? (
                        <div>
                            <h5>YOU OWE</h5>
                                {youOwed.map((story) => {
                                    return(
                                        <div onClick={() => {
                                                            setSelectedStory(story)
                                                            setShowSelectedStoty(true)
                                                        }}>
                                            <strong>{story.payer}</strong>
                                            <div>You owe {story.participants[currentUser.email]}</div>
                                        </div>
                                    )
                                })}

                        </div>
                ) : <div>No ones owes you</div>}

                        <div className="vertical-seperator"></div>

                        <div className="">
                            {youAreOwed.length > 0  ? (
                                <div>
                                    <h5>YOU ARE OWED</h5>
                                    {youAreOwed.map((story) => {
                                        return (
                                            <div>
                                                {getParticipants(story).map((p) => {
                                                    return (
                                                        <div onClick={() => {
                                                            setSelectedStory(story)
                                                            setShowSelectedStoty(true)
                                                        }}
                                                            >
                                                            <strong>{p}</strong>
                                                            <p>owed you {story.participants[p]}</p>
                                                        </div>

                                                    )
                                                })}

                                            </div>
                                        )
                                    })}
                                </div>
                            ) : <div>You are not owed anything</div>}

                        </div>

            </div>

            <Modal
                      show={showSelectedStory}
                      onHide={() => setShowSelectedStoty(false)}
                      backdrop="static"
                      keyboard={false}
                  >
                      <Modal.Header closeButton>
                          <Modal.Title>{storyDescription}</Modal.Title>
                      </Modal.Header>
                <Modal.Body>
                    <div className="story-details">
                        <div><strong>Date</strong>: {storyDate}</div>
                            <div>
                                <div className="modal-payer">{payer}</div>
                                <strong className="cost">{paid}</strong>
                            </div>
                            <div>
                                <div className="modal-payer">{lenter}</div>
                                <strong>{lent}</strong>
                            </div>
                        </div>
                </Modal.Body>
            </Modal>

        </>

    )
}

export default Home