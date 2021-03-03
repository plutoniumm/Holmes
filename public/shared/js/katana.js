const find = ( selector, node = document.body ) => node.querySelector( selector );
const findAll = ( selector, node = document.body ) => [ ...node.querySelectorAll( selector ) ];