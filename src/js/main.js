import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';
import  $  from  "jquery";
import Alert from 'bootstrap/js/dist/alert'
import { Tooltip, Toast, Popover } from 'bootstrap'

function LoadPage(pageName){
    $.ajax({
        method:'get',
        url:pageName,
        success:(response)=>{
            $("main").html(response);
        }
    })
}

$(function(){
    $("#passwordcontainer").hide();

    $(document).on("click","#usersignin",()=>{
        LoadPage('user-login.html');
        $("#maincontainer").hide();
        $("header").height(100);
    })

    $(document).on("click","#adminsignin",()=>{
       LoadPage('admin-login.html');
       $("#maincontainer").hide();
       $("header").height(100);
    })

    var email = "";
    $(document).on("click","#Getstartedbtn",()=>{
        email = $("#Email").val();
        if(email==""){
            alert("Please Enter Your Email Id");
        }
        $.ajax({
            method:'get',

            url:"http://127.0.0.1:5050/getusers",
            success: (users)=>{
                var user = users.find(item => item.Email===email);
                if(user){
                    if(user.Email===email){
                        $("#passwordcontainer").show();
                        $("#emailcontainer").hide();
                        $("#error").hide();
                    }
                }else{
                    $("#error").html(`
                     <div class="mt-4">User Doesn't Exist - 
                      <button class="btn btn-danger w-100" id="UserRegister">Register</button>
                     </div>
                    `);
                }
            }
        })
     })
    
     $(document).on("click","#btnHomesignin",()=>{
        $.ajax({
            method:'get',
            url:"http://127.0.0.1:5050/getusers",
            success: (users)=>{
                var user = users.find(item=>item.Email===email);
                if(user){
                    if(user.Password===$("#Password").val()){
                        localStorage.setItem("username",user.UserName);
                        alert("Login Success");
                        $("#passwordcontainer").hide();
                        // LoadPage('user-home.html');
                        LoadVideos();
                        $("#usersignin").html(`
                        ${user.UserName} <button class="btn btn-warning w-100" id="btnSignout"
                        >Signout</button>
                       `)
                        // $("#usersignin").html(`${localStorage.getItem("username")} - SignOut`);
                        $("#maincontainer").hide();
                        $("header").height(100);
                        
                    }else{
                        alert("Invalid Password");
                    }
                }
            }
        })
     })
     
     //Register logic for new users
     $(document).on("click","#UserRegister",()=>{
        LoadPage('user-register.html');
        $("#error").hide();
     })

     $(document).on("click","#btnRegister",()=>{
        var user = {
            "UserId":$("#UserId").val(),
            "UserName":$("#UserName").val(),
            "Password":$("#RPassword").val(),
            "Email":$("#REmail").val(),
            "Mobile":$("#Mobile").val()
        }
        $.ajax({
            method:'post',
            url: "http://127.0.0.1:5050/adduser",
            data: user
        })
        alert("Register successfully..");
        LoadPage('user-login.html');
     })
     

     //user Login Logic 

     $(document).on("click","#btnLogin",()=>{
        $.ajax({
            method:'get',
            url:"http://127.0.0.1:5050/getusers",
            success: (users)=>{
                var user = users.find(item => item.UserName==$("#LoginUserName").val());

                if(user.UserName==$("#LoginUserName").val() && user.Password==$("#LoginPassword").val())
                {
                    //  LoadPage('user-home.html');
                     LoadVideos();
                     $("#UserNameHome").html(`${localStorage.getItem("username")}`);
                     $("#maincontainer").hide();
                     $("header").height(100);
                    $("#usersignin").html(`
                     ${user.UserName} <button class="btn btn-warning w-100" id="btnSignout"
                     >Signout</button>
                    `)
                }else{
                    alert("Invalid userName or Password");
                }
            }
        })
     })

     //Signout Logic

     $(document).on("click","#btnSignout",()=>{
         location.reload();
     })

    //LoadVideos Logic

    function LoadVideos(){
        $("main").html("");
        $.ajax({
            method:'get',
            url:"http://127.0.0.1:5050/getvideos",
            success: (videos)=>{
               videos.map(video=>{
                $(`
                 <div class="d-flex bg-light justify-content-around p-2">
                   <div class="card w-75">
                    <div><iframe height="400" class="card-img-top" src=${video.Url}></iframe></div>
                    <div class="card-header text-center">
                     ${video.Title}
                    </div>
                   </div>
                 
                 </div>
                `).appendTo("main");
               })
            }
        })
    }

    //admin logics starts from here


    //admin user login

    $(document).on("click","#AdminLogin",()=>{
        $.ajax({
            method:'get',
            url:"http://127.0.0.1:5050/getadmin",
            success: (users)=>{
                var user = users.find(admin=> admin.UserName==$("#AdminUserName").val());
                if(user.UserName==$("#AdminUserName").val()&& user.Password==$("#AdminPassword").val()){
                    LoadPage('admin-dashboard.html');
                    LoadAdminVideos();
                    $("#maincontainer").hide();
                    $("header").height(100);
                    $("#adminsignin").html(`
                    ${user.UserName}<button class="btn btn-warning w-100" id="btnSignout"
                    >Signout</button>
                   `);
                    
                } else{
                    alert("Invalid Admin Details");
                }
            }
        })
    })

    //Admin Load Page

    function LoadAdminVideos(){
        $("main").html("");
        $.ajax({
            method:'get',
            url:"http://127.0.0.1:5050/getvideos",
            success: (videos)=>{
                videos.map(video=>{
                    $(`
                    <tr>
                     <td>${video.Title}</td>
                     <td><iframe src=${video.Url} width="200" height="100"></iframe></td>
                     <td>
                      <button id="btnEdit" name=${video.VideoId} class="btn btn-warning bi bi-pen-fill"></button>
                      <button id="btnDelete" name=${video.VideoId} class="btn btn-danger bi bi-trash-fill"></button>
                     </td>
                    </tr>
                    `).appendTo("tbody");
                })
            }
        })
    }
    
    //Load Categories

    function LoadCategories(){
        $.ajax({
            method: 'get',
            url:"http://127.0.0.1:5050/getcategories",
            success: (categories)=>{
                categories.map(category=>{
                    $(`
                    <option value=${category.CategoryName}>${category.CategoryName}</option>
                    `).appendTo("#lstCategories");
                })
            }
        })
    }

    //add New Video logic
    $(document).on("click","#btnAddNew",()=>{
        LoadPage('admin-new-video.html');
        LoadCategories();
    })

    $(document).on("click","#btnAddVideo",()=>{
        var video = {
            VideoId: $("#VideoId").val(),
            Title: $("#Title").val(),
            Url: $("#Url").val(),
            Likes:$("#Likes").val(),
            Views: $("#Views").val(),
            CategoryName: $("#lstCategories").val()
        };
        $.ajax({
            method:'post',
            url:"http://127.0.0.1:5050/addvideo",
            data: (video)
        })
        alert('Video Added Successfully..');
        LoadPage('admin-dashboard.html');
        LoadAdminVideos();
    })
    

    //Edit Video Logic

    var id;
    $(document).on("click","#btnEdit",(e)=>{
      LoadPage('admin-edit-video.html');
      LoadCategories();
      id = parseInt(e.target.name);

      $.ajax({
        method:'get',
        url:`http://127.0.0.1:5050/getvideo/${id}`,
        success: (video)=>{
            $("#VideoId").val(video[0].VideoId);
            $("#Title").val(video[0].Title);
            $("#Url").val(video[0].Url);
            $("#Likes").val(video[0].Likes);
            $("#Views").val(video[0].Views);
            $("#lstCategories").val(video[0].CategoryName);
        }
      })
    })

    //Video Update Logic

    $(document).on("click","#btnUpdateVideo",()=>{
        var video = {
            VideoId:$("#VideoId").val(),
            Title:$("#Title").val(),
            Url:$("#Url").val(),
            Likes:$("#Likes").val(),
            Views:$("#Views").val(),
            CategoryName:$("#lstCategories").val()
        };
        $.ajax({
            method:'put',
            url:`http://127.0.0.1:5050/updatevideo/${id}`,
            data: video
        })
        alert("Video Updated...");
        LoadPage("admin-dashboard.html");
        LoadAdminVideos();
    })

     //Edit Cancel Logic

     $(document).on("click","#btnCancel",()=>{
        LoadPage('admin-dashboard.html');
        LoadAdminVideos();
    })
    

    //Delete Video logic

    $(document).on("click","#btnDelete",(e)=>{
        var id = parseInt(e.target.name);
        var flag = confirm("Are You Sure?\nWant to Delete?");
        if(flag==true){
            $.ajax({
                method:'delete',
                url:`http://127.0.0.1:5050/deletevideo/${id}`,
            })
            alert("Video Deleted successfully...");
            LoadPage("admin-dashboard.html");
            LoadAdminVideos();
        }
    })


})

