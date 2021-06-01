import React from "react";

function EditForm({ recipe }) {
  const [name, setName] = React.useState(recipe.name);
  const [ingredients, setIngredients] = React.useState(recipe.ingredients);
  const [steps, setSteps] = React.useState(recipe.recipe);
  const handleChange = (e, key) => {
    setIngredients(key, e.target.value);
  };
  const submitEdit = (e) => {
    e.preventDefault();
    let data = {
      name: name,
      ingredients,
      recipe:steps
    };
    fetch(`http://localhost:3000/recipes/${recipe.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => console.log("Success:", JSON.stringify(response)));
    window.location.reload(false);
  };
  return (
    <form onSubmit={submitEdit}>
      <h2 style={{ textDecoration: "underline" }}>Edit Recipe</h2>
      <div key={recipe.name} className="col-lg-3">
        <input
          type="text"
          className="form-control"
          placeholder="Recipe Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <h4 style={{ textDecoration: "underline" }}>Ingredients</h4>
      <div className="form-row">
        {ingredients.map((item, index) => {
          return (
            <>
              <div key={index} className="col-lg-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder={item.ingName}
                  name="ingName"
                  value={item.ingName}
                  onChange={(e) => {
                    setIngredients(
                      ingredients.map((ingredient) => {
                        if (ingredient === item) {
                          return {
                            ...ingredient,
                            ingName: e.currentTarget.value,
                          };
                        }
                        return ingredient;
                      })
                    );
                  }}
                />
              </div>
              <div key={index + 1} className="col-lg-4">
                <input
                  key={index + 2}
                  type="text"
                  className="form-control"
                  placeholder={item.quantity}
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => {
                    setIngredients(
                      ingredients.map((ingredient) => {
                        if (ingredient === item) {
                          return {
                            ...ingredient,
                            quantity: e.currentTarget.value,
                          };
                        }
                        return ingredient;
                      })
                    );
                  }}
                />
              </div>
              <div key={index + 3} className="col-lg-4">
                <input
                  key={index + 4}
                  type="text"
                  className="form-control"
                  placeholder={item.unit}
                  name="unit"
                  value={item.unit}
                  onChange={(e) => {
                    setIngredients(
                      ingredients.map((ingredient) => {
                        if (ingredient === item) {
                          return {
                            ...ingredient,
                            unit: e.currentTarget.value,
                          };
                        }
                        return ingredient;
                      })
                    );
                  }}
                />
              </div>
            </>
          );
        })}
      </div>
      <h4 style={{ textDecoration: "underline" }}>How to make ?</h4>
      <div className="col-lg-12" style={{ display: "flex" }}>
        {steps.map((item,index) =>{
          return <> 
          <textarea
          style={{ height: "100px" }}
          type="text"
          className="form-control"
          placeholder="Step"
          name="step"
          value={item}
          onChange={(e) =>{
            let val = [...steps];
            val[index] = e.currentTarget.value
            setSteps(val)}}
        /> 
        </>
        })}
      </div>
      <button type="submit" className="btn-success">
        Edit recipe
      </button>
    </form>
  );
}

export default EditForm;
