import Button from 'react-bootstrap/Button'
import editIcon from '../img/pencil.svg'
import deleteIcon from '../img/trash.svg'
import { PostContext } from '../../context/PlanContext'
import { useContext } from 'react'

const ActionButtons = ({ _id }) => {
	const { deletePost, findPost, setShowUpdatePostModal } = useContext(
		PostContext
	)

	const choosePost = postId => {
		findPost(postId)
		setShowUpdatePostModal(true)
	}

	return (
		<>
			
			<Button className='post-button' onClick={choosePost.bind(this, _id)}>
				<img src={editIcon} alt='edit' width='28' height='28' />
			</Button>
			<Button   className='post-button' onClick={deletePost.bind(this, _id)}>
				<img src={deleteIcon} alt='delete' width='28' height='28' />
			</Button>
		</>
	)
}

export default ActionButtons