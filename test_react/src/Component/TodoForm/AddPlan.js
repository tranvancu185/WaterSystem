import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useContext, useState } from 'react'
import { PostContext } from '../../context/PlanContext'
import './AddPlan.css'

const AddPostModal = () => {
	// Contexts
	const {
		showAddPostModal,
		setShowAddPostModal,
		addPost,
		setShowToast
	} = useContext(PostContext)

	// State
	const [newPost, setNewPost] = useState({
		title: '',
		description: '',
		status: 'TO DO'
	})

	const { title, description } = newPost

	const onChangeNewPostForm = event =>
		setNewPost({ ...newPost, [event.target.name]: event.target.value })

	const closeDialog = () => {
		resetAddPostData()
	}

	const onSubmit = async event => {
		event.preventDefault()
		const { success, message } = await addPost(newPost)
		resetAddPostData()
		setShowToast({ show: true, message, type: success ? 'success' : 'danger' })
	}

	const resetAddPostData = () => {
		setNewPost({ title: '', description: '', status: 'TO DO' })
		setShowAddPostModal(false)
	}

	return (
		<Modal className="add-plan-form" show={showAddPostModal} onHide={closeDialog}>
			<Modal.Header >
				<Modal.Title>What do you want to do?</Modal.Title>
			</Modal.Header>
			<Form onSubmit={onSubmit}>
				<Modal.Body>
					<Form.Group>
						<Form.Control
							type='text'
							placeholder='Title'
							name='title'
							required
							aria-describedby='title-help'
							value={title}
							onChange={onChangeNewPostForm}
							className='input-title'
						/>
						<Form.Text id='title-help' muted>
							Required
						</Form.Text>
					</Form.Group>
					<Form.Group>
						<Form.Control
							as='textarea'
							rows={3}
							placeholder='Description'
							name='description'
							value={description}
							onChange={onChangeNewPostForm}
							className='input-description'
						/>
					</Form.Group>
					
				</Modal.Body>
				<Modal.Footer>
					<Button className='btn-do' variant='primary' type='submit'>
						DoIt!
					</Button>
					<Button className='btn-cancel' variant='secondary' onClick={closeDialog}>
						Cancel
					</Button>
					
				</Modal.Footer>
			</Form>
		</Modal>
	)
}

export default AddPostModal