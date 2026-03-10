import "./styles/global.scss"
import { useState } from "react"
import axios from "axios"
import { useEffect } from "react"

function App() {

  const [ notes, setNotes ] = useState([])
  const [ title, setTitle ] = useState("")
  const [ description, setDescription ] = useState("")

  async function getNotes() {
    /**
     * GET http://localhost:3000/notes
     * 
     */
    axios.get("http://localhost:3000/notes")
      .then(response => {
        console.log(response.data.notes)
        setNotes(response.data.notes)
      })
  }

  function handleSubmit(e) {
    e.preventDefault()

    axios.post("http://localhost:3000/notes", {
      title, description
    }).then(response => {
      console.log(response.data)
      getNotes()
      setTitle("")
      setDescription("")
    })


  }

  function handleDelete(id) {
    axios.delete(`http://localhost:3000/notes/${id}`)
      .then(response => {
        getNotes()
      })
  }

  useEffect(() => {
    getNotes()
  }, [])



  return (
    <main className="main-page" >

      <form onSubmit={handleSubmit} className="create-note-form" >
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value) }}
          type="text" placeholder="title" />
        <textarea
          value={description}
          onChange={(e) => { setDescription(e.target.value) }}
          name="description" id="description" placeholder="Note description"></textarea>
        <button className="button primary-button" >Create Note</button>
      </form>

      <div className="notes">
        {notes.map((note) => {
          return (
            <div className="note">
              <div className="top">
                <h1 className="title" >{note.title}</h1>
                <button
                  onClick={() => { handleDelete(note._id) }}
                  className="button primary-button" >Delete</button>
              </div>
              <p className="description" >{note.description}</p>
            </div>
          )
        })}
      </div>
    </main>
  )
}

export default App
