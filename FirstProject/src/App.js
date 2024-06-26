import React, { Component } from 'react';
import sortBy from 'sort-by';
import {  CSSTransitionGroup  } from 'react-transition-group';
import SwipeableViews from 'react-swipeable-views';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {  Tabs, Tab  } from 'material-ui/Tabs';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import ListIcon from 'material-ui/svg-icons/action/list';
import TodoIcon from 'material-ui/svg-icons/action/today';
import EditIcon from 'material-ui/svg-icons/action/delete';
import CloseIcon from 'material-ui/svg-icons/content/delete-sweep';
import ColumnList from './ColumnList';
import ConfirmDialog from './ConfirmDialog';
import If from './If';
import './App.css';
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import SnackbarContent from "@material-ui/core/SnackbarContent";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
			open: false,
			actionstate:false,
			deletion: false,
      items: [],
      taskIdCounter: 0,
      submitDisabled: true,
      slideIndex: 0,
      dialogOpen: false,
      removeMode: false,
    };
  }
	handleToClose = (event, reason) => {
		if (reason === "clickaway") return;
		this.setState({ open: false });
		this.setState({ deletion: false });
		this.setState({ actionstate: false });
	};

  componentWillMount() {
    const toDoListItems = window.localStorage.getItem('toDoListItems') || '[]';
    const taskIdCounter = window.localStorage.getItem('taskIdCounter') || 0;
    this.setState({
      items: JSON.parse(toDoListItems),
      taskIdCounter: Number(taskIdCounter),
    });
  }

  addTask = () => {
    const input = this.taskInput.input || {};
    const { value = '' } = input;

    if (value === '') return;

    this.setState(
      (previousState) => {
        const { items = [] } = previousState;
        const { taskIdCounter = 0 } = previousState;
        const taskId = taskIdCounter + 1;
        const newTask = {
          id: taskId,
          title: value,
          status: 'To Do',
        };
        items.push(newTask);
        this.setState({ open:true});
        return {
          items: items.sort(sortBy('id')),
          submitDisabled: true,
          taskIdCounter: taskId,
        };
      },
      function stateUpdateComplete() {
        this.taskInput.input.value = '';
        this.updateLocalStorageItems(this.state.items);
        this.updateTaskCounter(this.state.taskIdCounter);
      }
    );
  };

  handleUpdateTask = (task) => {
    this.setState(
      (previousState) => {
        const { items } = previousState;
        const updatedItems = items.map((item) =>
          item.id === task.id ? { ...item, status: task.status === 'To Do' ? 'Done' : 'To Do' } : item
        );
        return {
          items: updatedItems.sort(sortBy('id')),
        };
      },
      () => {
        this.updateLocalStorageItems(this.state.items);
      }
    );
    this.setState({ actionstate:true});
  };

  handleEditTask = (id, newTitle) => {
    this.setState(
      (previousState) => {
        const { items } = previousState;
        const updatedItems = items.map((item) =>
          item.id === id ? { ...item, title: newTitle } : item
        );
        return {
          items: updatedItems.sort(sortBy('id')),
        };
      },
      () => {
        this.updateLocalStorageItems(this.state.items);
      }
    );
  };

  handleRemoveTask = (task) => {
    this.setState(
      (previousState) => {
        const { items } = previousState;
        const filteredItems = items.filter((item) => item.id !== task.id);
        return {
          items: filteredItems.sort(sortBy('id')),
        };
      },
      () => {
        this.updateLocalStorageItems(this.state.items);
      }
    );
  };

  handleTextFieldChange = (event, value) => {
    if (value.length > 0 && this.state.submitDisabled) {
      this.setState({ submitDisabled: false });
    } else if (value.length === 0 && !this.state.submitDisabled) {
      this.setState({ submitDisabled: true });
    }
  };

  updateLocalStorageItems = (items) => {
    window.localStorage.setItem('toDoListItems', JSON.stringify(items));
  };

  updateTaskCounter = (taskCounter) => {
    window.localStorage.setItem('taskIdCounter', taskCounter);
  };

  handleChange = (value) => {
    this.setState(
      {
        slideIndex: value,
      },
      function stateUpdateComplete() {
        window.scrollTo(0, 0);
      }
    );
  };

  enableRemoveMode = () => {
    if (!this.state.removeMode) {
      this.setState({  removeMode: true  });
    }
  };

  disableRemoveMode = () => {
    if (this.state.removeMode) {
      this.setState({  removeMode: false  });
    }
  };

  clearTasks = () => {
    this.handleDialogClose();
    this.setState({  removeMode: false, items: []  }, function stateUpdateComplete() {
      this.updateLocalStorageItems(this.state.items);
    });
		this.setState( {deletion : true});
  };

  handleDialogOpen = () => {
    this.setState({  dialogOpen: true  });
  };

  handleDialogClose = () => {
    this.setState({  dialogOpen: false  });
  };

	/**
	 * @description Handle the enter key pressed under the add task input.
	 * @param {Object} e - Key press event
	 */
	keyPress = (e) => {
		// If Enter key
		if (e.keyCode === 13) {
			// Call method to add the task if not empty
			this.addTask();
			// put the login here
		}
	};

	// render() {
	// 	const { items = [] } = this.state;
	// 	const columns = [
	// 		{ title: 'To Do', items: items.filter(item => item.status === 'To Do'), icon: <TodoIcon /> },
	// 		{ title: 'Done', items: items.filter(item => item.status === 'Done'), icon: <CheckIcon /> },
	// 		{ title: 'All', items, icon: <ListIcon /> },
	// 	];
	// 	return (
	// 		<MuiThemeProvider>
	// 			<div>

	// 				<Snackbar
	// 					anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
	// 					open={this.state.open}
	// 					autoHideDuration={3000}
	// 					onClose={this.handleToClose}
	// 				>
	// 					<SnackbarContent
	// 						style={{ backgroundColor: "green" }} 
	// 						message="Task added successfully"
	// 						action={
	// 							<React.Fragment>
	// 								<IconButton
	// 									size="small"
	// 									aria-label="close"
	// 									color="inherit"
	// 									onClick={this.handleToClose}
	// 								>
	// 									<CloseIcon fontSize="small" />
	// 								</IconButton>
	// 							</React.Fragment>
	// 						}
	// 					/>
	// 				</Snackbar>
	// 			</div>
	// 			<div>
	// 			    <Snackbar
	// 					anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
	// 					open={this.state.deletion}
	// 					autoHideDuration={3000}
	// 					onClose={this.handleToClose}
	// 				>
	// 					<SnackbarContent
	// 						style={{ backgroundColor: "red" }} 
	// 						message="All tasks have been removed !"
	// 						action={
	// 							<React.Fragment>
	// 								<IconButton
	// 									size="small"
	// 									aria-label="close"
	// 									color="inherit"
	// 									onClick={this.handleToClose}
	// 								>
	// 									<CloseIcon fontSize="small" />
	// 								</IconButton>
	// 							</React.Fragment>
	// 						}
	// 					/>
	// 				</Snackbar>
	// 			</div>

	// 			<div>
	// 			    <Snackbar
	// 					anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
	// 					open={this.state.actionstate}
	// 					autoHideDuration={3000}
	// 					onClose={this.handleToClose}
	// 				>
	// 					<SnackbarContent
	// 						style={{ backgroundColor: "blue" }} 
	// 						message="Task status changed!"
	// 						action={
	// 							<React.Fragment>
	// 								<IconButton
	// 									size="small"
	// 									aria-label="close"
	// 									color="inherit"
	// 									onClick={this.handleToClose}
	// 								>
	// 									<CloseIcon fontSize="small" />
	// 								</IconButton>
	// 							</React.Fragment>
	// 						}
	// 					/>
	// 				</Snackbar>
	// 			</div>
				
	// 			<div className="App">
	// 				{/* Clear Tasks Confirmation Dialog */}
	// 				<ConfirmDialog
	// 					title="Clear All Tasks"
	// 					message={'Are you sure you want to remove all tasks from the App?'}
	// 					onCancel={this.handleDialogClose}
	// 					onConfirm={this.clearTasks}
	// 					open={this.state.dialogOpen}
	// 				/>
	// 				<AppBar
	// 					title={<span style={{ color: 'white' }}>To-Do List</span>}
	// 					showMenuIconButton={false}
	// 					style={{ backgroundColor: 'rgb(0, 151, 167)', position: 'fixed', zIndex: 9999, }}
	// 				/>
	// 				<div className="App-container">
	// 					<div style={{ position: 'fixed', width: '100%', paddingTop: 64, zIndex: 8888, backgroundColor: 'white' }}>
	// 						<TextField
	// 							hintText="Type task"
	// 							floatingLabelText="Add Task"
	// 							ref={(taskInput) => {
	// 								this.taskInput = taskInput;
	// 							}}
	// 							disabled={this.state.removeMode}
	// 							style={{ margin: 10, width: '60%', maxWidth: 300 }}
	// 							onChange={this.handleTextFieldChange}
	// 							onKeyDown={this.keyPress}
	// 						/>
	// 						<RaisedButton
	// 							style={{ margin: 10, width: '30%', maxWidth: 56 }}
	// 							label="Create"
	// 							onClick={this.addTask}
	// 							disabled={this.state.submitDisabled} />
	// 						<Tabs
	// 							onChange={this.handleChange}
	// 							value={this.state.slideIndex}
	// 						>
	// 							{columns.map((column, index) => (
	// 								<Tab
	// 									key={index}
	// 									value={index}
	// 									icon={column.icon}
	// 									label={
	// 										<div>
	// 											{column.title} ({(column.title !== 'All') ? column.items.filter(item => item.status === column.title).length : items.length})
	// 										</div>
	// 									}
	// 								/>
	// 							))}
	// 						</Tabs>
	// 					</div>
	// 					<div className="app-separator">-</div>
	// 					<CSSTransitionGroup
	// 						transitionName="remove-mode-animation"
	// 						transitionEnterTimeout={300}
	// 						transitionLeaveTimeout={300}>
	// 						{this.state.removeMode &&
	// 							<div className="remove-mode">
	// 								<RaisedButton
	// 									label="Delete All Tasks"
	// 									secondary={true}
	// 									onClick={this.handleDialogOpen}
	// 								/>
	// 							</div>
	// 						}
	// 						<div className="app-lists">
	// 							<SwipeableViews
	// 								index={this.state.slideIndex}
	// 								onChangeIndex={this.handleChange}
	// 								style={{ width: '100%' }}
	// 							>
	// 								{columns.map((column, index) => (
	// 									<div
	// 										className="swipeable-views"
	// 										key={index}>
	// 										<ColumnList
	// 											title={column.title}
	// 											items={column.items}
	// 											updateTask={this.handleUpdateTask}
	// 											removeTask={this.handleRemoveTask}
	// 											removeMode={this.state.removeMode}
	// 										/>
	// 									</div>
	// 								))}
	// 							</SwipeableViews>
	// 						</div>
	// 					</CSSTransitionGroup>
	// 				</div>
	// 				<div className="enable-remove-mode">
	// 					<If test={!this.state.removeMode}>
	// 						<FloatingActionButton onClick={this.enableRemoveMode}>
	// 							<EditIcon />
	// 						</FloatingActionButton>
	// 					</If>
	// 					<If test={this.state.removeMode}>
	// 						<FloatingActionButton secondary={true} onClick={this.disableRemoveMode}>
	// 							<CloseIcon />
	// 						</FloatingActionButton>
	// 					</If>
	// 				</div>
	// 			</div>
	// 		</MuiThemeProvider>
	// 	);
	// }
  render() {
    const { items = [] } = this.state;
    const columns = [
      { title: 'To Do', items: items.filter((item) => item.status === 'To Do'), icon: <TodoIcon /> },
      { title: 'Done', items: items.filter((item) => item.status === 'Done'), icon: <CheckIcon /> },
      { title: 'All', items, icon: <ListIcon /> },
    ];
    return (
      <MuiThemeProvider>
        <div>

          <Snackbar
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            open={this.state.open}
            autoHideDuration={3000}
            onClose={this.handleToClose}
          >
            <SnackbarContent
              style={{ backgroundColor: "green" }} 
              message="Task added successfully"
              action={
                <React.Fragment>
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={this.handleToClose}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </React.Fragment>
              }
            />
          </Snackbar>
          </div>
          <div>
            <Snackbar
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            open={this.state.deletion}
            autoHideDuration={3000}
            onClose={this.handleToClose}
          >
            <SnackbarContent
              style={{ backgroundColor: "red" }} 
              message="All tasks have been removed !"
              action={
                <React.Fragment>
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={this.handleToClose}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </React.Fragment>
              }
            />
          </Snackbar>
          </div>

          <div>
            <Snackbar
            anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            open={this.state.actionstate}
            autoHideDuration={3000}
            onClose={this.handleToClose}
          >
            <SnackbarContent
              style={{ backgroundColor: "blue" }} 
              message="Task status changed!"
              action={
                <React.Fragment>
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={this.handleToClose}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </React.Fragment>
              }
            />
          </Snackbar>
          </div>
        <div className="App">
          <ConfirmDialog
            title="Clear All Tasks"
            message={'Are you sure you want to remove all tasks from the App?'}
            onCancel={this.handleDialogClose}
            onConfirm={this.clearTasks}
            open={this.state.dialogOpen}
          />
          <AppBar
            title={<span style={{ color: 'white' }}>To-Do List</span>}
            showMenuIconButton={false}
            style={{ backgroundColor: 'rgb(0, 151, 167)', position: 'fixed', zIndex: 9999 }}
          />
          <div className="App-container" style={{ paddingTop: 80 }}>
            <CSSTransitionGroup
              transitionName="remove-mode-animation"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}
            >
              {this.state.removeMode && (
                <RaisedButton
                  label="Clear All Tasks"
                  secondary={true}
                  onClick={this.handleDialogOpen}
                  style={{ margin: '10px 0' }}
                />
              )}
            </CSSTransitionGroup>
            <div>
              <TextField
                hintText="Type task"
                floatingLabelText="Add Task"
                ref={(taskInput) => {
                  this.taskInput = taskInput;
                }}
                disabled={this.state.removeMode}
                style={{ margin: 10, width: '60%', maxWidth: 300 }}
                onChange={this.handleTextFieldChange}
                onKeyDown={this.keyPress}
              />
              <RaisedButton style={{ margin: 10, width: '30%', maxWidth: 56 }} label="Create" onClick={this.addTask} disabled={this.state.submitDisabled} />
              <Tabs onChange={this.handleChange} value={this.state.slideIndex}>
                {columns.map((column, index) => (
                  <Tab
                    key={index}
                    value={index}
                    icon={column.icon}
                    label={
                      <div>
                        {column.title} ({column.items.length})
                      </div>
                    }
                  />
                ))}
              </Tabs>
            </div>
            <div className="app-lists">
              <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange} style={{ width: '100%' }}>
                {columns.map((column, index) => (
                  <div className="swipeable-views" key={index}>
                    <ColumnList
                      title={column.title}
                      items={column.items}
                      updateTask={this.handleUpdateTask}
                      removeTask={this.handleRemoveTask}
                      removeMode={this.state.removeMode}
                      editTask={this.handleEditTask} // Pass the new editTask method
                    />
                  </div>
                ))}
              </SwipeableViews>
            </div>
            <div className="enable-remove-mode">
              <If test={!this.state.removeMode}>
                <FloatingActionButton onClick={this.enableRemoveMode}>
                  <EditIcon />
                </FloatingActionButton>
              </If>
              <If test={this.state.removeMode}>
                <FloatingActionButton secondary={true} onClick={this.disableRemoveMode}>
                  <CloseIcon />
                </FloatingActionButton>
              </If>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
