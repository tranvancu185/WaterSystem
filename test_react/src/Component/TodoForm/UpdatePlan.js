import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useContext, useState, useEffect } from 'react'
import { PostContext } from '../../context/PlanContext'
import './UpdatePlan.css'

const UpdatePostModal = () => {
	// Contexts
	const {
		postState: { post },
		showUpdatePostModal,
		setShowUpdatePostModal,
		updatePost,
		setShowToast
	} = useContext(PostContext)

	// State
	const [updatedPost, setUpdatedPost] = useState(post)

	useEffect(() => setUpdatedPost(post), [post])

	const { title, description, status } = updatedPost

	const onChangeUpdatedPostForm = event =>
		setUpdatedPost({ ...updatedPost, [event.target.name]: event.target.value })

	const closeDialog = () => {
		setUpdatedPost(post)
		setShowUpdatePostModal(false)
	}

	const onSubmit = async event => {
		event.preventDefault()
		const { success, message } = await updatePost(updatedPost)
		setShowUpdatePostModal(false)
		setShowToast({ show: true, message, type: success ? 'success' : 'danger' })
	}

	// const resetAddPostData = () => {
	// 	setNewPost({ title: '', description: '', url: '', status: 'TO LEARN' })
	// 	setShowAddPostModal(false)
	// }

	return (
		<Modal className='update-plan-form' show={showUpdatePostModal} onHide={closeDialog}>
			<Modal.Header >
				<Modal.Title>Making progress?</Modal.Title>
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
							onChange={onChangeUpdatedPostForm}
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
							onChange={onChangeUpdatedPostForm}
							className='input-description'
						/>
					</Form.Group>
					
					<Form.Group>
						<Form.Control
							as='select'
							value={status}
							name='status'
							onChange={onChangeUpdatedPostForm}
							className='status-bar'
						>
							<option value='TO DO'>TO DO</option>
							<option value='DOING'>DOING</option>
							<option value='DONE'>DONE</option>
						</Form.Control>
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

export default UpdatePostModal