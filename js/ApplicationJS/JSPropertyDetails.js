var jsPropertyDetails=new function () {
    this.GetPropertyAddress=function () {

        var searchKey=$("#propSearch").val();
                $.ajax({
                    url: "http://localhost:63683/api/EmployeeDetails/GetPropertyAddresses",
                    type: "Get",
                    data: {
                        searchKey: searchKey,
                    },
                    success: function (data) {
                        $('.divATC').find('ul li').remove()
                        $(".divATC").show()
                        if(data.length>0) {
                            $(data).each(function () {
                                $(".divATC").find('ul').append("<li class='list-group-item liselect' onclick='jsPropertyDetails.GetPropertyDetails(this)' zipCode='"+this.Zipcode+"' class='spnATC'>" + this.StreetNumber + " " + this.StreetName + ", " + this.City + ", " + this.County + " " + this.Zipcode + " </li>")
                            })
                        }else
                        {
                            $(".divATC").hide()
                        }
                    },
                    error: function () {
                        alert("Error Occurred");
                    },
                });
    }

    this.GetPropertyDetails=function (_e) {
        var currZip=$(_e).attr('zipCode');
        $.ajax({
            url: "http://localhost:63683/api/EmployeeDetails/GetPropertyAddresses",
            type: "Get",
            data: {
                searchKey: currZip,
            },
            success: function (data) {
                $(".divATC").hide();
                $("#divpropDetail").find('table tbody tr').remove()
                $("#divpropDetail").show();
                if(data.length>0) {
                    $(data).each(function () {
                        $("#divpropDetail").find('table tbody').append("<tr><td>"+this.StreetNumber+"</td><td>"+this.StreetName+"</td><td>"+this.City+"</td><td>"+this.Zipcode+"</td><td>"+this.County+"</td><td><a href='javascript:void(0);'><i class='fa fa-eye'></i></td></tr>>")
                    })
                }else
                {
                    $("#divpropDetail").append('<tr><td>No Records Found!!</td></tr>>')
                }
            },
            error: function () {
                alert("Error Occurred");
            },
        });
    }

    this.OnSearchPropDetails=function () {
        var currSearch=$("#propSearch").val();
        $.ajax({
            url: "http://localhost:63683/api/EmployeeDetails/GetPropertyAddresses",
            type: "Get",
            data: {
                searchKey: currSearch,
            },
            success: function (data) {
                $(".divATC").hide();
                $("#divpropDetail").find('table tbody tr').remove()
                $("#divpropDetail").show();
                if(data.length>0) {
                    $(data).each(function () {
                        $("#divpropDetail").find('table tbody').append("<tr><td>"+this.StreetNumber+"</td><td>"+this.StreetName+"</td><td>"+this.City+"</td><td>"+this.Zipcode+"</td><td>"+this.County+"</td><td><a href='javascript:void(0);'><i class='fa fa-eye'></i></td></tr>>")
                    })
                }else
                {
                    $("#divpropDetail").find('table tbody tr').remove()
                    $("#divpropDetail").find('table tbody').append('<tr><td colspan="6">No Records Found!!</td></tr>>')
                }
            },
            error: function () {
                alert("Error Occurred");
            },
        });
    }
}