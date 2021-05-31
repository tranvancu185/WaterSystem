import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import ActionButtons from './ActionButton'
import './SinglePlan.css'

const SinglePost = ({ post: { _id, status, title, description } }) => (
	<Card
		className='card-plan'
		border={
			status === 'DONE'
				? 'success'
				: status === 'DOING'
				? 'warning'
				: 'danger'
		}
	>
		<Card.Body>
			<Card.Title>
				<Row>
					<Col>
						<p className='post-title'>{title}</p>
						
					</Col>
					<Col className='btn-edit'>
						<ActionButtons  _id={_id} />
					</Col>
				</Row>
					<Row>
					<Badge
							className='post-status'
							pill
							// variant={
							// 	status === 'DONE'
							// 		? 'success'
							// 		: status === 'DOING'
							// 		? 'warning'
							// 		: 'danger'
							// }
						>
							{status}
						</Badge>
					</Row>
					
				
			</Card.Title>
			<Card.Text className='post-description'>{description}</Card.Text>
		</Card.Body>
	</Card>
)

export default SinglePost