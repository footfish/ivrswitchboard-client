import React from 'react'
import MenuActionSelect from '../components/MenuActionSelect'


const MenuActionSequence = props => 
(<div>
{props.actionSettingsArray.map( (settings, index) => 
    <li class="list-group-item">
    <MenuActionSelect index={index} settings={settings} onChange={props.onChange} onDeleteClick={props.onDeleteClick} /></li>
)}
    
</div>)
    
export default MenuActionSequence