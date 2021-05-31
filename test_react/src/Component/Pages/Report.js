import React from 'react'
import './Report-page.css'

import ReportPage from '../ReportPage/ReportPage'
import Plan from '../TodoForm/PlanForm'

function Report() {
    return (
        <div className='report-container'>
            <div className='plan'>
            <Plan/>
            </div>
            <div className='report-table' >
            <ReportPage/>
            </div>
            
        </div>
    )
}

export default Report
