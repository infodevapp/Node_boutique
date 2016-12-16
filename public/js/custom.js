


$(document).ready(function(){
    //search synamic page accuille
    $('#search').keyup(function(){
        var search_term = $(this).val();
        $.ajax({
            method : 'post',
            url : '/api/search',
            data : {
                search_term : search_term
            },
            dataType: 'json',
            success : function(json){
                products = json.hits.hits.map(function(hit){
                    return hit;
                });
                $('#searchResults').empty();
                for(var i = 0; i<products.length ; i++){
                    var html = '';
                    html += '<div class="col-xs-12 col-sm-6 col-md-4 testingNowGrunt">';
                       html +='<div class="panel panel-default">';
                           html +='<div class="panel-body">';
                             html +='<div class="thumbnail">';
                               html +=  '<img src="'+ products[i]._source.image +'" alt="'+ products[i]._source.name +'" />';
                             html +='</div>';
                             html +='<div class="caption">';
                             html +=  '<h5>';
                                 html +=  '<center>'+ products[i]._source.name +'</center>';
                               html +='</h5>';
                              html +='<p>'+ products[i]._source.description +'</p>';
                            html +='</div>';
                          html +='</div>';
                          html +='<div class="panel-footer">';
                              html +='<div class="col-xs-6 col-sm-3 col-md-3 price">';
                                html +='<center><s>'+ products[i]._source.price  +' </s> DNT</center>';
                              html +='</div>';
                              html +='<div class="col-xs-6 col-sm-3 col-md-3 price ">';
                                html +='<center>'+ products[i]._source.price - 50 +' DNT</center>';
                            html +=  '</div>';
                            html +=  '<div class="col-xs-6 col-sm-3 col-md-3">';
                              html +=  '<center><i class="glyphicon glyphicon-heart wiswish" id="wiswish"></i></center>';
                              html +='</div>';
                            html +='<div class="col-xs-6 col-sm-3 col-md-3">';
                              html +='<center><i class="glyphicon glyphicon-shopping-cart cart-shop" id="panier"></i></center>';
                            html +='</div>';
                          html +=  '<div class="clearfix"></div>';
                        html +=  '</div>';
                      html +='</div>';
                    html +='</div>';
                    $('#searchResults').append(html);
                }
            },
            error : function(err){
                console.log(err);
            }
        });
    });
});
