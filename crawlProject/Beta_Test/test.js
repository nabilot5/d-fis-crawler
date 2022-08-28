

// Recovery of json data with ajax
const dataRecovery = () => {
    // Recovery through AJAX
    const displayArrayOfRestaurant = (allOfRestaurants) => {
        let restaurant = '';
        for (i in allOfRestaurants) {
            restaurant += `
            <tr>
                <td scope="row">${i}</td>
                <td scope="row">${allOfRestaurants[i].name}</td>
                <td>${allOfRestaurants[i].phone}</td>
            </tr>`;
        }
        return restaurant
    }


    let i = 0;
    $.ajax({
        url: "../20220812122725.json",
        type: "GET",
        dataType: "json",
        success: function (allOfRestaurants) {
            i++;
            console.log(allOfRestaurants);
            document.getElementById('display').innerHTML = `
            <div class="container">
                <h1> La liste de tous les restaurants</h1>
                    <table class="table table-bordered table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Nom</th>
                                <th scope="col">Numéro de téléphone</th>
                            </tr>
                        </thead>
                        <tbody> 
                            <tr>
                                ${displayArrayOfRestaurant(allOfRestaurants)}
                            </tr>
                        </tbody>
                    </table>
            </div>`;
        }
    });
}

dataRecovery();