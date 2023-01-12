/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */

"use strict"

if (!jeeFrontEnd.system) {
  jeeFrontEnd.system = {
    init: function() {
      window.jeeP = this
      document.querySelectorAll('ul.bs-sidenav li a').forEach(_cmd => {
        _cmd.title = _cmd.getAttribute('data-command')
      })
    },
  }
}

jeeFrontEnd.system.init()


$('.bt_systemCommand').off('click').on('click', function(event) {
  let me = event.target.closest('.bt_systemCommand')
  var command = me.getAttribute('data-command')
  document.getElementById('pre_commandResult').empty()
  if (me.parentNode.hasClass('list-group-item-danger')) {
    jeeDialog.confirm('{{Êtes-vous sûr de vouloir éxécuter cette commande :}} <strong>' + command + '</strong> ? {{Celle-ci est classé en dangereuse}}', function(result) {
      if (result) {
        jeedom.ssh({
          command: command,
          success: function(log) {
            document.getElementById('h3_executeCommand').empty().append('{{Commande :}}' + ' ' + command)
            document.getElementById('pre_commandResult').append(log)
          }
        })
      }
    })
  } else {
    jeedom.ssh({
      command: command,
      success: function(log) {
        document.getElementById('h3_executeCommand').empty().append('{{Commande :}}' + ' ' + command)
        document.getElementById('pre_commandResult').append(log)
      }
    })
  }
})

$('#ul_listSystemHistory').off('click', '.bt_systemCommand').on('click', '.bt_systemCommand', function(event) {
  let me = event.target.closest('.bt_systemCommand')
  var command = me.getAttribute('data-command')
  document.getElementById('pre_commandResult').empty()
  document.getElementById('div_commandResult').empty()
  jeedom.ssh({
    command: command,
    success: function(log) {
      document.getElementById('h3_executeCommand').empty().append('{{Commande :}}' + ' ' + command)
      document.getElementById('in_specificCommand').value = command
      document.getElementById('pre_commandResult').append(log)
    }
  })
})

$('#bt_validateSpecifiCommand').off('click').on('click', function(event) {
  var command = document.getElementById('in_specificCommand').value
  document.getElementById('pre_commandResult').empty()
  jeedom.ssh({
    command: command,
    success: function(log) {
      document.getElementById('h3_executeCommand').empty().append('{{Commande :}}' + ' ' + command)
      document.getElementById('pre_commandResult').append(log)
      let insertCmd = '<li class="cursor list-group-item list-group-item-success"><a class="bt_systemCommand" data-command="' + command + '">' + command + '</a></li>'
      document.getElementById('ul_listSystemHistory').insertAdjacentHTML('afterbegin', insertCmd)
      var kids = document.getElementById('ul_listSystemHistory').children
      if (kids.length >= 10) {
        kids.last().remove()
      }
    }
  })
})

$('#in_specificCommand').keypress(function(event) {
  if (event.which == 13) {
    var command = document.getElementById('in_specificCommand').value
    document.getElementById('pre_commandResult').empty()
    jeedom.ssh({
      command: command,
      success: function(log) {
        document.getElementById('h3_executeCommand').empty().append('{{Commande :}}' + ' ' + command)
        document.getElementById('pre_commandResult').append(log)
        let cmd = document.querySelector('.bt_systemCommand[data-command="' + command.replace(/"/g, '\\"') + '"]')
        if (cmd != null) {
          let insertCmd = '<li class="cursor list-group-item list-group-item-success"><a class="bt_systemCommand" data-command="' + command.replace(/"/g, '\\"') + '">' + command + '</a></li>'
          document.getElementById('ul_listSystemHistory').insertAdjacentHTML('afterbegin', insertCmd)
        }
        var kids = document.getElementById('ul_listSystemHistory').children
        if (kids.length >= 10) {
          kids.last().remove()
        }
      }
    })
  }
})

//Manage events outside parents delegations:



/*Events delegations
*/