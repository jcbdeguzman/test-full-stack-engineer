import React, { Component } from 'react';
import './Main.css';
import { connect } from 'react-redux';
import { fetchShips, fetchShipCount } from '../../redux/actions/shipActions';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shipTypes: ["Barge","Cargo","High Speed Craft","Tug"],
      shipType: "Barge",
      weight: '',
      homePort: '',
      rowsPerPage: 5, // default is 5
      currentPage: 1 // default is first page
    };
  }
  
  componentDidMount() {
    this.props.fetchShipCount();
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.fetchShips(this.state.shipType,this.state.weight,this.state.homePort,this.state.rowsPerPage,this.state.currentPage);
  }

  getPageCount() {
    var elementArr = [];
    for(var i = 0; i <= (this.props.shipCount / this.state.rowsPerPage); i++) {
      elementArr.push(
        <li className={"page-item"}>
          <a className="page-link" href="#">
            {i+1}
          </a>
        </li>
      );
    }
    return elementArr;
  }

  getSpaceItem(s) {
    return s.hasOwnProperty('spaceItem') ? JSON.parse(s.spaceItem) : s
  }

  render() {
    return (
      <div className="container pt-5 h-100 form-control-inline">
        <div className="row h-100 justify-content-center align-items-center">
          <form className="col-12" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="shipTypeSelect">Ship type</label>
              <select className="form-control form-input" id="shipTypeSelect" onChange={(e) => { this.setState({ shipType: e.target[e.target.selectedIndex].text })}}>
                {this.state.shipTypes.map((s_type,i) => {
                  return (
                    <option key={s_type}>{s_type}</option>
                  );
                })}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="weight">Weight</label>
              <input type="number" className="form-control form-input" id="weight" placeholder="Ship's weight in kilograms" onChange={(e) => { this.setState({ weight: e.target.value })}} />
            </div>
            <div className="form-group">
            <label htmlFor="homePort">Home port</label>
              <input type="text" className="form-control form-input" id="homePort" placeholder="e.g. Port Canaveral" onChange={(e) => { this.setState({ homePort: e.target.value })}} />
            </div>
            <button type="submit" className="btn btn-primary form-btn">Search</button>
          </form>  
        </div>
        <button type="button" className="btn btn-primary form-btn" onClick={() => this.props.fetchShips('','','',this.state.rowsPerPage,this.state.currentPage)}>List all ships</button>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Ship Type</th>
              <th scope="col">Weight</th>
              <th scope="col">Home Port</th>
              <th scope="col">Ship Name</th>
              <th scope="col">Class</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {this.props.shipList.map(s => {
              return (
                <tr key={this.getSpaceItem(s).ship_id}>
                  <th scope="row">{this.getSpaceItem(s).ship_type}</th>
                  <td>{this.getSpaceItem(s).weight_kg}{this.getSpaceItem(s).weight_kg > 0 ? " kg":"N/A"}</td>
                  <td>{this.getSpaceItem(s).home_port}</td>
                  <td>{this.getSpaceItem(s).ship_name}</td>
                  <td>{this.getSpaceItem(s).class}{this.getSpaceItem(s).class > 0 ? " kg":"N/A"}</td>
                  <td><button type="button" className="btn btn-primary form-btn">Upload icon</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {this.props.shipList.length > 0 && 
        <nav>
          <ul className="pagination">
            <li className="page-item disabled">
              <span className="page-link">Previous</span>
            </li>
            {this.getPageCount()}
            <li className="page-item">
              <a className="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  shipList: state.ships.shipList,
  shipCount: state.ships.shipCount
});

export default connect(mapStateToProps, { fetchShips, fetchShipCount })(Main);
