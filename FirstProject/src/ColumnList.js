import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import Checkbox from 'material-ui/Checkbox';
import { List, ListItem } from 'material-ui/List';
import MobileTearSheet from './MobileTearSheet';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import TextField from 'material-ui/TextField';
import './ColumnList.css';
import 'semantic-ui-css/semantic.min.css';
import { Button, Icon, Rating, ButtonContent } from 'semantic-ui-react';

/**
 * This object is used for type checking the props of the component.
 */
const propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array,
  updateTask: PropTypes.func.isRequired,
  removeTask: PropTypes.func.isRequired,
  removeMode: PropTypes.bool,
  editTask: PropTypes.func.isRequired, // Add this line
};

/**
 * This object sets default values to the optional props.
 */
const defaultProps = {
  items: [],
  removeMode: false,
};

/**
 * @description Represents the column list element.
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {string} props.title - The title of this column list.
 * @param {Object[]} [props.items=[]] - The array of tasks/items of the list.
 * @param {removeTask} props.removeTask - Callback executed when user clicks to remove the task.
 * @param {updateTask} props.updateTask - Callback executed when the done checkbox is clicked.
 * @param {boolean} [props.removeMode=false] - Indicates whether the app is in remove mode.
 * @param {editTask} props.editTask - Callback executed when the task name is edited.
 * @returns {XML} Return the stateless component markup.
 * @constructor
 */
const ColumnList = (props) => {
  const [editMode, setEditMode] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const handleEditClick = (item) => {
    setEditMode(item.id);
    setNewTitle(item.title);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleSaveClick = (item) => {
    props.editTask(item.id, newTitle);
    setEditMode(null);
  };

  return (
    <div className="column-list">
      <MobileTearSheet style={{ padding: 10 }}>
        <List>
          <CSSTransitionGroup
            transitionName="task-animation"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {props.items.map((item) => (
              <ListItem
                key={item.id}
                rightIcon={
                  props.removeMode ? (
                    <DeleteIcon onClick={() => props.removeTask(item)} />
                  ) : (
                    <DeleteIcon style={{ visibility: 'hidden' }} />
                  )
                }
              >
                <Rating className="Rating" icon="star" maxRating={1} />
                {editMode === item.id ? (
                  <div>
                    <TextField
                      value={newTitle}
                      onChange={handleTitleChange}
                      onBlur={() => handleSaveClick(item)} // Save on blur
                    />
                    <Button onClick={() => handleSaveClick(item)}>
                      <ButtonContent visible>Save</ButtonContent>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <span>{item.title}</span>
                    <Button onClick={() => handleEditClick(item)} animated>
                      <ButtonContent visible>Edit</ButtonContent>
                      <ButtonContent hidden>
                        <Icon name="edit" />
                      </ButtonContent>
                    </Button>
                  </div>
                )}
                <Checkbox
                  label=""
                  disabled={props.removeMode}
                  checked={item.status === 'Done'}
                  className={item.status === 'Done' ? 'task-done' : ''}
                  onCheck={() => props.updateTask(item)}
                />
              </ListItem>
            ))}
          </CSSTransitionGroup>
        </List>
      </MobileTearSheet>
    </div>
  );
};

// Type checking the props of the component
ColumnList.propTypes = propTypes;

// Assign default values to the optional props
ColumnList.defaultProps = defaultProps;

export default ColumnList;
