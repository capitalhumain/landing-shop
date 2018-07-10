 
import { ADD_TODO, TOGGLE_TODO, REMOVE_TODO, REMOVE_ALL_TODOS, LOAD_TODO, INCREMENT, DECREMENT, SELECTED } from './actions';
 

export interface IAppState {
        todos: any[];
        lastUpdate: Date;
        count: number;
}

export const INITIAL_STATE: IAppState = {
        todos: [],
        lastUpdate: null,
        count: 0
}

export function rootReducer(state: IAppState, action): IAppState {

    switch (action.type) {

        case INCREMENT:
            var newCount = state.count +1;
            return Object.assign({}, state, {
                
                lastUpdate: new Date(),
                count :  newCount
            })


         case DECREMENT:
             var  newCount = state.count -1;
              
            return Object.assign({}, state, {
                
                lastUpdate: new Date(),
                 count :  newCount
            })

        case LOAD_TODO:
             var  newProducts = action.products;
             var todo = newProducts.find(t => t.tobuy === 1);
             newProducts.map((prod, i) => {
                     if (prod.id != todo.id){
                        newProducts[i].tobuy = 0;
                      }
                      if (prod.id < todo.id){
                        newProducts[i].toshow = 0;
                      }
                      if (prod.id > todo.id){
                        newProducts[i].toshow = 1;
                      }
               }); 
            return Object.assign({}, state, {
                todos: newProducts,
                lastUpdate: new Date()
            })    
            

        case ADD_TODO:
            action.todo.id = state.todos.length + 1;    
            return Object.assign({}, state, {
                todos: state.todos.concat(Object.assign({}, action.todo)),
                lastUpdate: new Date()
            })

        case TOGGLE_TODO:
            var todo = state.todos.find(t => t.id === action.id);
            var index = state.todos.indexOf(todo);
            return Object.assign({}, state, {
                todos: [
                    ...state.todos.slice(0, index),
                    Object.assign({}, todo, {toshow: !todo.toshow}),
                    ...state.todos.slice(index+1)
                ],
                lastUpdate: new Date()
            })

        case SELECTED:
            var todo = state.todos.find(t => t.id === action.id);
            var index = state.todos.indexOf(todo);
           // state.todos.find(item => item.id != action.id).tobuy = 0;
            state.todos.map((todo, i) => {
                     if (todo.id != action.id){
                        state.todos[i].tobuy = 0;
                      }
                      if (todo.id < action.id){
                        state.todos[i].toshow = 0;
                      }
                      if (todo.id > action.id){
                        state.todos[i].toshow = 1;
                      }
               });
            return Object.assign({}, state, {
                todos: [
                    ...state.todos.slice(0, index),
                    Object.assign({}, todo, {tobuy: 1, toshow: 1}),
                    ...state.todos.slice(index+1)
                ],
                lastUpdate: new Date()
            })

        case REMOVE_TODO:
            return Object.assign({}, state, {
                todos: state.todos.filter(t => t.id !== action.id),
                lastUpdate: new Date()
            })

        case REMOVE_ALL_TODOS:
            return Object.assign({}, state, {
                todos: [],
                lastUpdate: new Date()
            })
    }

    return state;
}