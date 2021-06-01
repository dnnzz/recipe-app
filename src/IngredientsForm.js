import React from 'react';

function IngredientsForm(props) {
    return (
        <div className="form-row">
        <div className="col-lg-3">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={props.list.name}
          />
        </div>
        <div className="col-lg-3">
          <input
            type="text"
            className="form-control"
            placeholder="Quantity"
            value={props.list.quantity}
          />
        </div>
        <div className="col-lg-3">
          <input type="text" className="form-control" placeholder="Unit"
           value={props.list.name} />
        </div>
      </div>
    );
}

export default IngredientsForm;