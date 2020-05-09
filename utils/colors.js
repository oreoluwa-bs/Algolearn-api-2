class colorHandler {
    constructor() {
        this.colors = [
            '#78C3FB', '#C28CAE', '#49475B', '#799496', '#4F646F',
            '#F87060', '#102542', '#137547', '#5BBA6F', '#F96F5D',
            '#F4AC32', '#2D93AD', '#43AA8B', '#383961', '#5F758E',
            '#995FA3', '#2D3047', '#419D78', '#E0A458', '#B7ADCF',
            '#95A78D', '#23967F', '#7DAF9C', '#DB93B0', '#F7BFB4',
            '#8F95D3', '#89DAFF', '#D3C4E3', '#DBB1BC', '#457EAC',
            '#9191E9', '#C2AFF0', '#E6AF2E', '#3D348B', '#D00000',
            '#136F63', '#032B43', '#3F88C5', '#FFBA08', '#F71735',
            '#FF9F1C', '#157A6E', '#499F68', '#77B28C', '#9649CB',
            '#DA4167', '#404E7C', '#251F47', '#B20D30', '#3F84E5',
            '#3F784C', '#274690', '#576CA8', '#DD1C1A', '#E70E02',
            '#F42B03', '#C33C54', '#DA2C38', '#B9314F', '#E15554',
        ];
    }

    generateRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
}
module.exports = colorHandler;

// const colors = [
//     '#78C3FB', '#C28CAE', '#49475B', '#799496', '#4F646F',
//     '#F87060', '#102542', '#137547', '#5BBA6F', '#F96F5D',
//     '#F4AC32', '#2D93AD', '#43AA8B', '#383961', '#5F758E',
//     '#995FA3', '#2D3047', '#419D78', '#E0A458', '#B7ADCF',
// ];

// const generateRandomColor = () => this.colors[Math.floor(Math.random() * this.colors.length)];


// module.exports = {
//     generateRandomColor,
//     colors,
// };

// const colorHandler = {};

// colorHandler.colors = [
//     '#78C3FB', '#C28CAE', '#49475B', '#799496', '#4F646F',
//     '#F87060', '#102542', '#137547', '#5BBA6F', '#F96F5D',
//     '#F4AC32', '#2D93AD', '#43AA8B', '#383961', '#5F758E',
//     '#995FA3', '#2D3047', '#419D78', '#E0A458', '#B7ADCF',
// ];

// colorHandler.getColor = () => (
//     colorHandler.colors[Math.floor(Math.random() * colorHandler.colors.length)];
//     )
