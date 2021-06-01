import logo from "./logo.svg";
import "./App.css";
import React from "react";
import EditForm from "./EditForm";

function App() {
  const [recipes, setRecipes] = React.useState(null);
  const [isClicked, setClick] = React.useState(false);
  const [editButton, setEditButton] = React.useState(false);
  const [inputList, setInputList] = React.useState({
    ingName: "",
    quantity: "",
    unit: "",
  });
  const [step, setStep] = React.useState("");
  const [recipe, setRecipe] = React.useState([]);
  const [name, setName] = React.useState("");
  const [ingredients, setIngredients] = React.useState([]);
  const [editElement, setElement] = React.useState(null);
  const [menu, setMenu] = React.useState([]);
  const[total,setTotal] = React.useState([]);
  const [indexCount,setCount] = React.useState(-1);
  const getRecipes = async () => {
    fetch("http://localhost:3000/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputList({ ...inputList, [name]: value });
  };
  const handleAddClick = () => {
    const arr = ingredients.concat(inputList);
    setInputList({ ingName: "", quantity: "", unit: "" });
    setIngredients(arr);
  };
  const editItem = (val) => {
    setEditButton(true);
    setElement(recipes.find((item) => item.id === parseInt(val)));
  };
  const ingredientFunc = (input1,input2) => {
    const output = input1.reduce(
      (acc, input) => {
        const matchedItem =
          input2.length > 0 &&
          input2.find((item) => item.ingName === input.ingName);
        if (matchedItem) {
          const updatedItem = {
            ingName: input.ingName,
            quantity: Number(input.quantity) + Number(matchedItem.quantity),
            unit: input.unit,
          };
          acc.item.push(updatedItem);
          acc.toFilter.push(matchedItem.ingName);
        } else {
          acc.item.push(input);
        }
        return acc;
      },
      { item: [], toFilter: [] }
    );

    const filteredOutput = input2.filter(
      (item) => !output.toFilter.includes(item.ingName)
    );
    const totalValues = [...output.item, ...filteredOutput];
    setTotal(totalValues);
  }
  const addItem = async (e) => {
    e.preventDefault();
    let data = {
      name: name,
      recipe: recipe,
      ingredients,
    };
    setName("");
    setStep("");
    setRecipe([]);
    setIngredients([]);

    fetch("http://localhost:3000/recipes", {
      method: "POST",
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
  const deleteItem = async (val) => {
    fetch(`http://localhost:3000/recipes/${val}`, { method: "DELETE" })
      .catch((error) => console.error("Error:", error))
      .then((response) => console.log("Success:", JSON.stringify(response)));
    window.location.reload(false);
  };
  React.useEffect(() => {
    getRecipes();
  }, []);
  React.useEffect(() => {
    if(menu.length === 1 ){
      setTotal(menu[0].ingredients);
    }
      if(menu.length === 2){
        const input1 = menu[0].ingredients;
        const input2 = menu[1].ingredients;
        ingredientFunc(input1,input2)
      }
      if(menu.length >= 3){
        const input1 = total;
        const input2 = menu[indexCount].ingredients;
        ingredientFunc(input1,input2);
        }
      
  },[menu.length,indexCount]);
  if (!recipes) {
    return <h1>No recipe found !</h1>;
  }
  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-6">
            <div className="recipes">
              <button
                onClick={(e) => setClick(true)}
                type="button"
                className="btn-lg btn-primary"
              >
                Add Recipe
              </button>
              <h3>Recipes List</h3>
              <ol className="recipe-list">
                {recipes.map((item, index) => (
                  <li key={item.id}>
                    <h3>{item.name}</h3>
                    <button
                      value={item.id}
                      onClick={(e) => editItem(e.target.value)}
                      className="btn-xs btn-warning"
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      value={item.id}
                      onClick={(e) => deleteItem(e.target.value)}
                      className="btn-xs btn-danger"
                      type="button"
                    >
                      Delete
                    </button>
                    <button
                      value={item.id}
                      onClick={(e) => {
                        setMenu([
                          ...menu,
                          { name: item.name, ingredients: item.ingredients },
                        ]);
                        setCount(indexCount+1);
                      }}
                      className="btn-xs btn-light"
                      type="button"
                    >
                      Make {item.name}
                    </button>
                    <ul style={{ listStyle: "none" }}>
                      <strong>Ingredients</strong>:
                      {item.ingredients.map((x, i) => (
                        <li key={i}>
                          {x.ingName} : {x.quantity} {x.unit}
                        </li>
                      ))}
                    </ul>
                    <strong>Recipe</strong>:
                    {item.recipe.map((el, ind) => (
                      <div className="recipe-step" key={ind}>
                        {el}, <br />
                      </div>
                    ))}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="col-md-6 col-lg-6">
            <div className="ingredients-wrapper">
              <h3>Cook list</h3>
              <ol className="ingredients">
                {menu.map((item, index) => (
                  <li key={index}>
                    {item.name} <br />{" "}
                  </li>
                ))}
              </ol>
              <h2>Total ingredients:</h2>
              {total.map(total => <p>{total.ingName} : {total.quantity} {total.unit}</p>)}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <button
              onClick={(e) =>
                isClicked === true ? setClick(false) : setEditButton(false)
              }
              className="btn-danger btn-lg float-right"
            >
              X
            </button>
            {isClicked === true ? (
              <form onSubmit={addItem}>
                <h2 style={{ textDecoration: "underline" }}>Add Recipe</h2>
                <div className="col-lg-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Recipe Name"
                    name="recipeName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <h4 style={{ textDecoration: "underline" }}>Ingredients</h4>
                <div className="form-row">
                  <div className="col-lg-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="name"
                      name="ingName"
                      value={inputList.ingName}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                  <div className="col-lg-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Quantity"
                      name="quantity"
                      value={inputList.quantity}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                  <div className="col-lg-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Unit"
                      name="unit"
                      value={inputList.unit}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                  <button type="button" onClick={handleAddClick}>
                    Add
                  </button>
                </div>
                <h4 style={{ textDecoration: "underline" }}>How to make ?</h4>
                <div className="col-lg-3" style={{ display: "flex" }}>
                  <textarea
                    style={{ height: "100px" }}
                    type="text"
                    className="form-control"
                    placeholder="Step"
                    name="step"
                    value={step}
                    onChange={(e) => setStep(e.target.value)}
                  />
                  <button
                    style={{ height: "50px", width: "100px" }}
                    className="btn-info"
                    type="button"
                    onClick={(e) => {
                      setStep("");
                      setRecipe([...recipe, step]);
                    }}
                  >
                    Add Step
                  </button>
                </div>
                <button type="submit" className="btn-success">
                  add recipe
                </button>
              </form>
            ) : editButton === true ? (
              <EditForm key={editElement.id} recipe={editElement} />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
