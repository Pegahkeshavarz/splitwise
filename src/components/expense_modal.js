import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import React, {useEffect, useState} from "react";
import {addDoc, collection} from "firebase/firestore";
import {db} from "../firebase/firebase";
import {useAuth} from "../authContexts";


const SPLIT_TYPE = {
        EQUALLY: '=',
        PERCENTAGE: '%'
}

const ExpenseModal = (
    {
        showAddExpense,
        onCloseModal,
        setShowAddExpense
    }) => {

    const { currentUser } = useAuth();

    const date = new Date();
    const futureDate = date.getDate();
    date.setDate(futureDate);
    const defaultValue = date.toLocaleDateString('en-CA');

    const [emailAddress, setEmailAddress] = useState('');
    const [showSplitType, setShowSplitType] = useState(false);
    const [showPeopleList, setShowPeopleList] = useState(false);
    const [splitType, setSplitType] = useState(SPLIT_TYPE.EQUALLY);
    const [percentageToUser, setPercentageToUser] = useState({});
    const [costsBelongsTo, setCostsBelongsTo] = useState({})
    const [allChecked, setAllChecked] = useState([currentUser.email]);
    const [sharedPerson, setSharedPerson] = useState([]);
    const [selectedPayer, setSelectedPayer] = useState(currentUser.email);
    const [description, setDescription] = useState('');
    const [allCost, setAllCost] = useState('');
    const [transactionDate, setTransactionDate] = useState('');

    const calculateCost = (e, person) => {
        const newChecked = [...allChecked];
        if(newChecked.includes(person)) {
            newChecked.splice(newChecked.indexOf(person))
        } else {
            newChecked.push(person)
        }
        setAllChecked(newChecked)
    }

     const  onClickSaveSplitType = async () => {
        await addDoc(collection(db, "transactions"), {
            author: currentUser.email,
            totalExpense: allCost,
            payer: selectedPayer,
            description: description,
            date: transactionDate,
            participants: costsBelongsTo
        })
        setShowAddExpense(false)
    }

    useEffect(() => {
        let newList = {};
        if(SPLIT_TYPE.EQUALLY === splitType) {
            for(let per of [...sharedPerson, currentUser.email]) {
                if (allChecked.includes(per)) {
                    newList[per] = `$${(allCost / allChecked.length).toFixed(2)}`;
                } else {
                    newList[per] = '$0.00'
                }
            }

        } else {
            for(let per of [...sharedPerson, currentUser.email]) {
                if(percentageToUser[per] ){
                     newList[per] = `$${((percentageToUser[per] / 100) * allCost).toFixed(2)}`;
                }
            }
        }
        setCostsBelongsTo(newList)
    }, [allCost, allChecked, splitType, percentageToUser])

    return (
        <>
         <Modal
                    show={showAddExpense}
                    onHide={onCloseModal}
                      backdrop="static"
                      keyboard={false}
                  >
                      <Modal.Header closeButton>
                          <Modal.Title>Add an expense</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <div className="name-container">
                              {sharedPerson.length > 0 ? (
                                      <div className="shared-person">
                                          <p>{sharedPerson}</p>
                                          <button onClick={() => setSharedPerson('')}>X</button>
                                      </div>
                                  ) :
                                  <>
                                      with <strong>you</strong> and :
                                      <input
                                          className="email-input"
                                          value={emailAddress}
                                          placeholder={"Enter email address"}
                                          onKeyDown={(e) => {
                                              if(e.key === 'Enter') {
                                                  const newSharedPeople = [...sharedPerson];
                                                  newSharedPeople.push(emailAddress)
                                                  setAllChecked([...newSharedPeople, currentUser.email])

                                                  setSharedPerson(newSharedPeople)
                                              }
                                          }}
                                          onChange={(e) => setEmailAddress(e.target.value)}/>
                                      {emailAddress.length > 0 && (
                                          <div className="hit-enter">Hit enter to add this person</div>
                                      )}
                                  </>
                              }
                          </div>

                          <div className="main-expense-container">
                              <div>
                                  <input
                                      className="des-input"
                                      placeholder="Enter a description"
                                      value={description}
                                      onChange={(e) => setDescription(e.target.value)}/>
                              </div>
                              <div className="cost-container">
                                  <span className="currency_code">$</span>
                                  <input
                                      className="cost"
                                      type="number"
                                      placeholder="0.00"
                                      value={allCost}
                                      onChange={(e) => setAllCost(e.target.value)}/>
                              </div>
                              <div className="human-summary">
                                  Paid by
                                  <a onClick={() => setShowPeopleList(true)}>
                                      {selectedPayer === currentUser.email ? "you" : selectedPayer}
                                  </a>
                                  and split
                                  <a onClick={() => setShowSplitType(true)}> {SPLIT_TYPE["EQUALLY"] === splitType ? "equally" : "unequally"}</a>
                                   &#8203;
                                  .
                                  {"($0.00/person)" ? allCost.length === 0 : "(you get back 900)"}
                              </div>
                              <div>
                                  <input className="date-input" type={"date"} value={transactionDate} defaultValue={defaultValue} onChange={(e) => setTransactionDate(e.target.value)}/>
                              </div>

                          </div>

                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="secondary" onClick={onCloseModal}>
                              Cancel
                          </Button>
                          <Button variant="primary" onClick={onClickSaveSplitType}>Save</Button>
                      </Modal.Footer>
                  </Modal>

                <Modal
                      show={showPeopleList}
                      onHide={() => setShowPeopleList(false)}
                      backdrop="static"
                      keyboard={false}
                  >
                      <Modal.Header closeButton>
                          <Modal.Title>Choose payer</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <div className="payer-wrapper">

                          {
                              [...sharedPerson, currentUser.email].map((person) => {
                                  return(
                                      <button
                                          className={[selectedPayer === person && "selected-person"].join(" ")}
                                          onClick={() => {
                                              setSelectedPayer(person)
                                              setShowPeopleList(false)
                                          }
                                          }>
                                          {person}
                                      </button>
                                  )
                              })
                          }
                           </div>
                      </Modal.Body>
                </Modal>

                <Modal
                      show={showSplitType}
                      onHide={() => setShowSplitType(false)}
                      backdrop="static"
                      keyboard={false}
                  >
                      <Modal.Header closeButton={true}>
                          <Modal.Title>Choose split options</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                          <div className="first-section">
                              <button >
                                  Split the expense
                              </button>
                          </div>
                          <div className="seperator"></div>
                          <div className="split-type-wrapper">
                              {Object.values(SPLIT_TYPE).map((type) => {
                                  return <button onClick={() => setSplitType(type)}>{type}</button>
                              })}
                          </div>
                          <div className="split-selected-wrapper">
                              <h4>{splitType === SPLIT_TYPE.EQUALLY ? "Split equally" : "Split by percentages"}</h4>
                          {splitType === SPLIT_TYPE.EQUALLY && (
                              <div>
                                  {[...sharedPerson, currentUser.email].map((person) => {
                                  return(
                                      <div className="split-type-row">
                                          <div>
                                              <input
                                                  onChange={(e) => calculateCost(e, person)}
                                                  type={"checkbox"}
                                                  value={person}
                                                  checked={allChecked.includes(person)}
                                                  name={person}/>
                                              <label className="person-label">{person}</label>
                                          </div>

                                          <div>{costsBelongsTo[person]}</div>
                                      </div>
                                  )
                                  })
                                  }</div>
                          )}

                              {splitType === SPLIT_TYPE.PERCENTAGE && (
                              <div>
                                  {[...sharedPerson, currentUser.email].map((person) => {
                                  return(
                                      <div className="split-type-row">
                                          <div>
                                              <strong>{person}</strong>
                                          </div>
                                          <div>
                                              <input
                                                  value={percentageToUser[person]}
                                                  onChange={(e) => {
                                                      const newPercentageMap = {...percentageToUser};
                                                      newPercentageMap[person] = e.target.value;
                                                      setPercentageToUser(newPercentageMap)
                                                  }
                                                  }
                                              />
                                              <label>%</label>
                                          </div>
                                      </div>
                                  )
                                  })
                                  }
                              </div>
                          )}

                          </div>
                      </Modal.Body>
                </Modal>
             </>
    )
}

export default ExpenseModal;