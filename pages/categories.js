import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name,setName] = useState('');
  const [parentCategory,setParentCategory] = useState('');
  const [platforms,setPlatforms] = useState([]);
  const [categories,setCategories] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, [])
  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setPlatforms(result.data);
    });
  }
  async function saveCategory(ev){
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      categories:categories.map(p => ({
        name:p.name,
        values:p.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    setParentCategory('');
    setCategories([]);
    fetchCategories();
  }
  function editCategory(platform){
    setEditedCategory(platform);
    setName(platform.name);
    setParentCategory(platform.parent?._id);
    setCategories(
      platform.category.map(({name,values}) => ({
      name,
      values:values.join(',')
    }))
    );
  }
  function deleteCategory(platform){
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${platform.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const {_id} = platform;
        await axios.delete('/api/categories?_id='+_id);
        fetchCategories();
      }
    });
  }
  function addProperty() {
    setCategories(prev => {
      return [...prev, {name:'',values:''}];
    });
  }
  function handlePropertyNameChange(index,category,newName) {
    setCategories(prev => {
      const categories = [...prev];
      categories[index].name = newName;
      return categories;
    });
  }
  function handlePropertyValuesChange(index,category,newValues) {
    setCategories(prev => {
      const categories = [...prev];
      categories[index].values = newValues;
      return categories;
    });
  }
  function removeProperty(indexToRemove) {
    setCategories(prev => {
      return [...prev].filter((p,pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>Platforms</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : 'Create new platform'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={'Platform name'}
            onChange={ev => setName(ev.target.value)}
            value={name}/>
          <select
                  onChange={ev => setParentCategory(ev.target.value)}
                  value={parentCategory}>
            <option value="">No parent platform</option>
            {platforms.length > 0 && platforms.map(platform => (
              <option key={platform._id} value={platform._id}>{platform.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Category</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2">
            Add new category
          </button>
          {categories.length > 0 && categories.map((category,index) => (
            <div key={category.name} className="flex gap-1 mb-2">
              <input type="text"
                     value={category.name}
                     className="mb-0"
                     onChange={ev => handlePropertyNameChange(index,category,ev.target.value)}
                     placeholder="category name (example: Action)"/>
              <input type=""
                     className="mb-0"
                     onChange={ev =>
                       handlePropertyValuesChange(
                         index,
                         category,ev.target.value
                       )}
                     value={category.values}
                     placeholder="values, comma separated"/>
              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="btn-red">
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setCategories([]);
              }}
              className="btn-default">Cancel</button>
          )}
          <button type="submit"
                  className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
          <tr>
            <td>Platform name</td>
            <td>Parent Platform</td>
            <td></td>
          </tr>
          </thead>
          <tbody>
          {platforms.length > 0 && platforms.map(category => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>{category?.parent?.name}</td>
              <td>
                <button
                  onClick={() => editCategory(category)}
                  className="btn-default mr-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(category)}
                  className="btn-red">Delete</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({swal}, ref) => (
  <Categories swal={swal} />
));
