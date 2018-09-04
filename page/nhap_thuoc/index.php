<?php ?>
<div class="bg-dark text-center text-light">
    <h2>KHO THUỐC</h2>
</div>
<div class="container d-flex flex-column flex-grow-1 flex-shrink-1">
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text"><i class="fa fa-search"></i></span>
        </div>
        <input class='form-control' type="text" id="thuoc--search" placeholder="Tim kiem (Ctrl + F)">
    </div>
    
    <!-- DANH SACH THUOC -->
    <div class="flex-grow-1">
        <table id='nhap_thuoc--table' class="table table-striped table-view">
            <thead>
                <tr>
                    <th>Ma thuoc</th>
                    <th>Ten Thuoc</th>
                    <th>Nha cung cap</th>
                    <th>Don Gia</th>
                    <th>So luong</th>
                </tr>
            </thead>
            <tbody class="flex-grow-1"></tbody>
        </table>
    </div>  
    

    <div class="w-100 d-flex flex-row justify-content-around p-4" style="min-height: 3em">

        <!-- NHAP MOI -->
        <button app-role="new" class="btn btn-warning thuoc--button">
            NHAP MOI<br>Ctrl+D
        </button>

        <!-- NHAP THEM -->
        <button app-role="add" class="btn btn-success thuoc--button" disabled>
            <i class="fas fa-plus-circle"></i> NHAP THEM<br>Enter
        </button>

        <!-- EDIT -->
        <button app-role="edit" class="btn btn-primary thuoc--button" disabled>
            <i class="fas fa-pen-square"></i> CHINH SUA<br>Ctrl+E
        </button>

        <!-- DIEU CHINH GIA -->
        <button app-role="chinh-gia" class="btn btn-default thuoc--button" disabled>
            <i class="fa fa-dollar-sign"></i> DIEU CHINH GIA <br>Ctrl+G
        </button>

    </div>

    <!-- modal new thuoc -->
    <div id="thuoc--new-modal" class="modal fade" aria-hidden='true' tabindex="-1"></div>

    <!-- modal edit thuoc -->
    <div id="thuoc--edit-modal" class="modal fade" aria-hidden='true' tabindex="-1"></div>

    <!-- modal add thuoc -->
    <div id="thuoc--add-modal" class="modal fade" aria-hidden='true' tabindex="-1"></div>

    <!-- modal add thuoc -->
    <div id="thuoc--edit-price-modal" class="modal fade" aria-hidden='true' tabindex="-1"></div>
</div>
