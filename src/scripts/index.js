import '../styles/index.scss';
import httpService from '../utils/httpService';

class MainContainer {
    constructor() {
        this.state = {
            cities: [],
            filters: {
                keyword: "",
                hd_enabled: false,
                one_way_enabled: false
            },
            filterdCity: {},
        }
        document.addEventListener('DOMContentLoaded', ()=>{
            httpService.setURL("https://api.zoomcar.com/v4/");
            httpService.getRequest({
                endPoint: 'cities',
                qParams: {
                    platform: 'web'
                },
                callback: (resp) => {
                    this.state.cities = resp.cities;
                    this.filterCities();
                }
            });
            document.getElementById("keyword").addEventListener("keyup", (e)=>{
                this.state.filters.keyword = e.currentTarget.value;
                this.filterCities();
            });
            document.getElementById("hd").addEventListener("change", (e)=>{
                this.state.filters.hd_enabled = e.target.checked;
                this.filterCities();
            });
            document.getElementById("owe").addEventListener("change", (e)=>{
                this.state.filters.one_way_enabled = e.target.checked;
                this.filterCities();
            });
        });
    }
    filterCities() {
        let citiesObj = {
            popular: [],
            others: []
        }
        const filters = this.state.filters;
        this.state.cities.forEach((cityObj)=>{
            if(filters.keyword.length == 0 || cityObj.name.toLowerCase().indexOf(filters.keyword.toLowerCase()) > -1) {
                if(filters.hd_enabled == cityObj.hd_enabled) {
                    if(filters.one_way_enabled == cityObj.one_way_enabled) {
                        if(cityObj.popular) {
                            citiesObj.popular.push(cityObj)
                        } else {
                            citiesObj.others.push(cityObj)
                        }
                    }
                }
            }
        });
        this.renderCities(citiesObj);
    }
    renderCities(citiesObj) {
        let popular = this.buildCityListDOM([...citiesObj.popular]);
        let others = this.buildCityListDOM([...citiesObj.others]);
        let popularDOM = `
            <div class="popular-cities">
            <h4>Popular</h4>
            <div class="cities-container">${popular}</div>         
        </div>`;
        let othersDOM = `
            <div class="others-cities">
                <h4>Others</h4>
                <div class="cities-container">${others}</div>
            </div>
        `;
        let DOM = "";
        if(popular.length > 0) {
            DOM += popularDOM;
        }
        if(others.length > 0) {
            DOM += othersDOM;
        }
        document.getElementById('cities').innerHTML = DOM;
    }
    buildCityListDOM(cities) {
        let citiesDOM = "";
        cities.forEach((city)=>{
            citiesDOM += this.getCityTemplate(city);
        });
        return citiesDOM;
    }
    getCityTemplate(cityObj) {
        return `
            <div class="zoom-city">
                <div class="city-icon">
                    <img src="${cityObj.icon}"/>
                </div>
                <div class="city-name">${cityObj.name}</div>
            </div>
        `;
    }
}

new MainContainer();