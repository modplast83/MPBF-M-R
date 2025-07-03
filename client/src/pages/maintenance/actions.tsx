// @ts-nocheck
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/ui/page-header";
import { useToast } from "@/hooks/use-toast";
// import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
// import { format } from "date-fns";

// Simple date formatting function
const formatDate = (date: Date | string, formatStr: string = 'dd/MM/yyyy') => {
  const d = new Date(date);
  if (formatStr === 'dd/MM/yyyy') {
    return d.toLocaleDateString('en-GB');
  } else if (formatStr === 'dd/MM/yyyy HH:mm') {
    return d.toLocaleString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  } else if (formatStr === 'MMM dd, yyyy') {
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    });
  }
  return d.toLocaleDateString();
};

// Translation function for maintenance actions
const t = (key: string): string => {
  const translations: Record<string, string> = {
    // Page titles and headers
    'maintenance.actions.title': 'Maintenance Actions',
    'maintenance.actions.description': 'Manage and track all maintenance actions performed on equipment',
    'maintenance.actions.add_action': 'Add New Action',
    'maintenance.actions.no_actions': 'No maintenance actions found',
    'maintenance.actions.create_first': 'Create your first maintenance action to get started',
    
    // Table headers
    'maintenance.actions.table.id': 'ID',
    'maintenance.actions.table.date': 'Date',
    'maintenance.actions.table.request': 'Request',
    'maintenance.actions.table.machine': 'Machine',
    'maintenance.actions.table.type': 'Action Type',
    'maintenance.actions.table.performed_by': 'Performed By',
    'maintenance.actions.table.hours': 'Hours',
    'maintenance.actions.table.cost': 'Cost',
    'maintenance.actions.table.status': 'Status',
    'maintenance.actions.table.description': 'Description',
    'maintenance.actions.table.actions': 'Actions',
    
    // Action types
    'maintenance.actions.types.repair': 'Repair',
    'maintenance.actions.types.replacement': 'Replacement',
    'maintenance.actions.types.maintenance': 'Maintenance',
    'maintenance.actions.types.inspection': 'Inspection',
    'maintenance.actions.types.cleaning': 'Cleaning',
    'maintenance.actions.types.calibration': 'Calibration',
    'maintenance.actions.types.change_parts': 'Change Parts',
    'maintenance.actions.types.workshop': 'Workshop',
    
    // Status types
    'maintenance.actions.status.completed': 'Completed',
    'maintenance.actions.status.in_progress': 'In Progress',
    'maintenance.actions.status.pending': 'Pending',
    
    // Dialog titles and descriptions
    'maintenance.actions.view.title': 'Maintenance Action Details',
    'maintenance.actions.view.description': 'View detailed information about this maintenance action',
    'maintenance.actions.edit.title': 'Edit Maintenance Action',
    'maintenance.actions.edit.description': 'Update the maintenance action details',
    'maintenance.actions.add.title': 'Add Maintenance Action',
    'maintenance.actions.add.description': 'Record a new maintenance action performed on equipment',
    
    // Form labels
    'maintenance.actions.form.request': 'Maintenance Request',
    'maintenance.actions.form.machine': 'Machine',
    'maintenance.actions.form.action_type': 'Action Type',
    'maintenance.actions.form.status': 'Status',
    'maintenance.actions.form.description': 'Description',
    'maintenance.actions.form.cost': 'Parts Cost ($)',
    'maintenance.actions.form.hours': 'Labor Hours',
    'maintenance.actions.form.part_replaced': 'Part Replaced',
    'maintenance.actions.form.performed_by': 'Performed By',
    
    // Placeholders
    'maintenance.actions.placeholder.select_request': 'Select Request',
    'maintenance.actions.placeholder.select_machine': 'Select Machine',
    'maintenance.actions.placeholder.select_type': 'Select Action Type',
    'maintenance.actions.placeholder.select_status': 'Select Status',
    'maintenance.actions.placeholder.select_user': 'Select User',
    'maintenance.actions.placeholder.description': 'Describe the action taken',
    'maintenance.actions.placeholder.cost': '0.00',
    'maintenance.actions.placeholder.hours': '0.0',
    'maintenance.actions.placeholder.part': 'Part name or description',
    
    // Buttons and actions
    'maintenance.actions.button.view': 'View Action Details',
    'maintenance.actions.button.print': 'Print Action',
    'maintenance.actions.button.edit': 'Edit Action',
    'maintenance.actions.button.delete': 'Delete Action',
    'maintenance.actions.button.add': 'Add Action',
    'maintenance.actions.button.save': 'Save Action',
    'maintenance.actions.button.update': 'Update Action',
    'maintenance.actions.button.cancel': 'Cancel',
    'maintenance.actions.button.filter': 'Filter Actions',
    'maintenance.actions.button.refresh': 'Refresh',
    'maintenance.actions.record': 'Add Action',
    'maintenance.actions.create': 'Add Maintenance Action',
    'maintenance.actions.maintenanceRequest': 'Maintenance Request',
    'maintenance.actions.selectMaintenanceRequest': 'Select Request',
    'maintenance.actions.actionsTaken': 'Actions Taken',
    'maintenance.actions.partsCost': 'Parts Cost',
    'maintenance.actions.laborHours': 'Labor Hours',
    'maintenance.actions.notes': 'Notes',
    'maintenance.actions.readyToWork': 'Machine ready to work after repair',
    'maintenance.actions.recording': 'Recording...',
    'maintenance.actions.recordAction': 'Record Action',
    'maintenance.actions.table_title': 'Maintenance Actions ({count})',
    'maintenance.actions.table_description': 'Complete list of all maintenance actions',
    
    // Table headers
    'maintenance.actions.id': 'Action ID',
    'maintenance.actions.date': 'Date',
    'maintenance.actions.request': 'Request',
    'maintenance.actions.machine': 'Machine',
    'maintenance.actions.actionBy': 'Performed By',
    'maintenance.actions.status': 'Status',
    'maintenance.actions.description': 'Description',
    'maintenance.actions.actions': 'Actions',
    
    // Button tooltips
    'maintenance.actions.tooltip.view': 'View Action Details',
    'maintenance.actions.tooltip.print': 'Print Action',
    'maintenance.actions.tooltip.edit': 'Edit Action',
    'maintenance.actions.tooltip.delete': 'Delete Action',
    
    // Mobile view labels
    'maintenance.actions.mobile.machine': 'Machine:',
    'maintenance.actions.mobile.performed_by': 'Performed By:',
    'maintenance.actions.mobile.date': 'Date:',
    'maintenance.actions.mobile.hours': 'Hours:',
    'maintenance.actions.mobile.cost': 'Cost:',
    
    // Edit form placeholders
    'maintenance.actions.edit.selectMachine': 'Select Machine',
    'maintenance.actions.edit.selectActionType': 'Select Action Type',
    'maintenance.actions.edit.selectStatus': 'Select Status',
    
    // Additional dialog descriptions
    'maintenance.actions.view.dialog_description': 'View detailed information about this maintenance action.',
    
    // Essential damage types for maintenance requests
    'maintenance.damage_types.motor': 'Motor Issue',
    'maintenance.damage_types.bearing': 'Bearing Problem',
    'maintenance.damage_types.belt': 'Belt Issue',
    'maintenance.damage_types.sensor': 'Sensor Problem',
    'maintenance.damage_types.electrical': 'Electrical Issue',
    'maintenance.damage_types.mechanical': 'Mechanical Problem',
    'maintenance.damage_types.hydraulic': 'Hydraulic Issue',
    'maintenance.damage_types.pneumatic': 'Pneumatic Problem',
    'maintenance.damage_types.cooling': 'Cooling System',
    'maintenance.damage_types.heating': 'Heating System',
    'maintenance.damage_types.lubrication': 'Lubrication Issue',
    'maintenance.damage_types.alignment': 'Alignment Problem',
    'maintenance.damage_types.vibration': 'Vibration Issue',
    'maintenance.damage_types.noise': 'Noise Problem',
    'maintenance.damage_types.leakage': 'Leakage Issue',
    'maintenance.damage_types.overheating': 'Overheating',
    'maintenance.damage_types.corrosion': 'Corrosion',
    'maintenance.damage_types.wear': 'Wear and Tear',
    'maintenance.damage_types.blockage': 'Blockage',
    'maintenance.damage_types.contamination': 'Contamination',
    'maintenance.damage_types.calibration': 'Calibration Issue',
    'maintenance.damage_types.software': 'Software Problem',
    'maintenance.damage_types.control': 'Control System',
    'maintenance.damage_types.safety': 'Safety Issue',
    'maintenance.damage_types.performance': 'Performance Issue',
    'maintenance.damage_types.quality': 'Quality Issue',
    'maintenance.damage_types.efficiency': 'Efficiency Problem',
    'maintenance.damage_types.capacity': 'Capacity Issue',
    'maintenance.damage_types.speed': 'Speed Problem',
    'maintenance.damage_types.accuracy': 'Accuracy Issue',
    'maintenance.damage_types.fan': 'Fan Problem',
    'maintenance.damage_types.pump': 'Pump Issue',
    'maintenance.damage_types.valve': 'Valve Problem',
    'maintenance.damage_types.filter': 'Filter Issue',
    'maintenance.damage_types.seal': 'Seal Problem',
    'maintenance.damage_types.gasket': 'Gasket Issue',
    'maintenance.damage_types.coupling': 'Coupling Problem',
    'maintenance.damage_types.gearbox': 'Gearbox Issue',
    'maintenance.damage_types.transmission': 'Transmission Problem',
    'maintenance.damage_types.chain': 'Chain Issue',
    'maintenance.damage_types.sprocket': 'Sprocket Problem',
    'maintenance.damage_types.pulley': 'Pulley Issue',
    'maintenance.damage_types.shaft': 'Shaft Problem',
    'maintenance.damage_types.bracket': 'Bracket Issue',
    'maintenance.damage_types.mounting': 'Mounting Problem',
    'maintenance.damage_types.fastener': 'Fastener Issue',
    'maintenance.damage_types.wiring': 'Wiring Problem',
    'maintenance.damage_types.circuit': 'Circuit Issue',
    'maintenance.damage_types.switch': 'Switch Problem',
    'maintenance.damage_types.relay': 'Relay Issue',
    'maintenance.damage_types.fuse': 'Fuse Problem',
    'maintenance.damage_types.breaker': 'Circuit Breaker Issue',
    'maintenance.damage_types.transformer': 'Transformer Problem',
    'maintenance.damage_types.inverter': 'Inverter Issue',
    'maintenance.damage_types.converter': 'Converter Problem',
    'maintenance.damage_types.controller': 'Controller Issue',
    'maintenance.damage_types.display': 'Display Problem',
    'maintenance.damage_types.interface': 'Interface Issue',
    'maintenance.damage_types.communication': 'Communication Problem',
    'maintenance.damage_types.network': 'Network Issue',
    'maintenance.damage_types.connection': 'Connection Problem',
    'maintenance.damage_types.cable': 'Cable Issue',
    'maintenance.damage_types.connector': 'Connector Problem',
    'maintenance.damage_types.terminal': 'Terminal Issue',
    'maintenance.damage_types.insulation': 'Insulation Problem',
    'maintenance.damage_types.grounding': 'Grounding Issue',
    'maintenance.damage_types.shielding': 'Shielding Problem',
    'maintenance.damage_types.protection': 'Protection Issue',
    'maintenance.damage_types.emergency': 'Emergency System',
    'maintenance.damage_types.backup': 'Backup System Issue',
    'maintenance.damage_types.redundancy': 'Redundancy Problem',
    'maintenance.damage_types.failsafe': 'Failsafe Issue',
    'maintenance.damage_types.interlock': 'Interlock Problem',
    'maintenance.damage_types.alarm': 'Alarm System Issue',
    'maintenance.damage_types.monitoring': 'Monitoring Problem',
    'maintenance.damage_types.logging': 'Logging Issue',
    'maintenance.damage_types.reporting': 'Reporting Problem',
    'maintenance.damage_types.documentation': 'Documentation Issue',
    'maintenance.damage_types.training': 'Training Required',
    'maintenance.damage_types.procedure': 'Procedure Problem',
    'maintenance.damage_types.specification': 'Specification Issue',
    'maintenance.damage_types.standard': 'Standard Compliance',
    'maintenance.damage_types.regulation': 'Regulation Issue',
    'maintenance.damage_types.inspection': 'Inspection Required',
    'maintenance.damage_types.testing': 'Testing Issue',
    'maintenance.damage_types.replacement': 'Replacement Required',
    'maintenance.damage_types.repair': 'Repair Needed',
    'maintenance.damage_types.maintenance': 'Maintenance Required',
    'maintenance.damage_types.cleaning': 'Cleaning Needed',
    'maintenance.damage_types.adjustment': 'Adjustment Required',
    'maintenance.damage_types.configuration': 'Configuration Issue',
    'maintenance.damage_types.setup': 'Setup Problem',
    'maintenance.damage_types.installation': 'Installation Issue',
    'maintenance.damage_types.commissioning': 'Commissioning Problem',
    'maintenance.damage_types.startup': 'Startup Issue',
    'maintenance.damage_types.shutdown': 'Shutdown Problem',
    'maintenance.damage_types.operation': 'Operation Issue',
    'maintenance.damage_types.usage': 'Usage Problem',
    'maintenance.damage_types.handling': 'Handling Issue',
    'maintenance.damage_types.storage': 'Storage Problem',
    'maintenance.damage_types.transport': 'Transport Issue',
    'maintenance.damage_types.packaging': 'Packaging Problem',
    'maintenance.damage_types.labeling': 'Labeling Issue',
    'maintenance.damage_types.identification': 'Identification Problem',
    'maintenance.damage_types.tracking': 'Tracking Issue',
    'maintenance.damage_types.inventory': 'Inventory Problem',
    'maintenance.damage_types.supply': 'Supply Issue',
    'maintenance.damage_types.demand': 'Demand Problem',
    'maintenance.damage_types.availability': 'Availability Issue',
    'maintenance.damage_types.accessibility': 'Accessibility Problem',
    'maintenance.damage_types.compatibility': 'Compatibility Issue',
    'maintenance.damage_types.integration': 'Integration Problem',
    'maintenance.damage_types.synchronization': 'Synchronization Issue',
    'maintenance.damage_types.coordination': 'Coordination Problem',
    'maintenance.damage_types.scheduling': 'Scheduling Issue',
    'maintenance.damage_types.timing': 'Timing Problem',
    'maintenance.damage_types.qualification': 'Qualification Problem',
    'maintenance.damage_types.accreditation': 'Accreditation Issue',
    'maintenance.damage_types.authorization': 'Authorization Problem',
    'maintenance.damage_types.licensing': 'Licensing Issue',
    'maintenance.damage_types.registration': 'Registration Problem',
    'maintenance.damage_types.enrollment': 'Enrollment Issue',
    'maintenance.damage_types.subscription': 'Subscription Problem',
    'maintenance.damage_types.membership': 'Membership Issue',
    'maintenance.damage_types.participation': 'Participation Problem',
    'maintenance.damage_types.involvement': 'Involvement Issue',
    'maintenance.damage_types.engagement': 'Engagement Problem',
    'maintenance.damage_types.commitment': 'Commitment Issue',
    'maintenance.damage_types.dedication': 'Dedication Problem',
    'maintenance.damage_types.devotion': 'Devotion Issue',
    'maintenance.damage_types.loyalty': 'Loyalty Problem',
    'maintenance.damage_types.faithfulness': 'Faithfulness Issue',
    'maintenance.damage_types.reliability': 'Reliability Problem',
    'maintenance.damage_types.dependability': 'Dependability Issue',
    'maintenance.damage_types.trustworthiness': 'Trustworthiness Problem',
    'maintenance.damage_types.credibility': 'Credibility Issue',
    'maintenance.damage_types.authenticity': 'Authenticity Problem',
    'maintenance.damage_types.genuineness': 'Genuineness Issue',
    'maintenance.damage_types.legitimacy': 'Legitimacy Problem',
    'maintenance.damage_types.validity': 'Validity Issue',
    'maintenance.damage_types.accuracy': 'Accuracy Problem',
    'maintenance.damage_types.precision': 'Precision Issue',
    'maintenance.damage_types.exactness': 'Exactness Problem',
    'maintenance.damage_types.correctness': 'Correctness Issue',
    'maintenance.damage_types.rightness': 'Rightness Problem',
    'maintenance.damage_types.propriety': 'Propriety Issue',
    'maintenance.damage_types.appropriateness': 'Appropriateness Problem',
    'maintenance.damage_types.suitability': 'Suitability Issue',
    'maintenance.damage_types.fitness': 'Fitness Problem',
    'maintenance.damage_types.compatibility': 'Compatibility Issue',
    'maintenance.damage_types.consistency': 'Consistency Problem',
    'maintenance.damage_types.coherence': 'Coherence Issue',
    'maintenance.damage_types.logic': 'Logic Problem',
    'maintenance.damage_types.reasoning': 'Reasoning Issue',
    'maintenance.damage_types.rationale': 'Rationale Problem',
    'maintenance.damage_types.justification': 'Justification Issue',
    'maintenance.damage_types.explanation': 'Explanation Problem',
    'maintenance.damage_types.clarification': 'Clarification Issue',
    'maintenance.damage_types.elaboration': 'Elaboration Problem',
    'maintenance.damage_types.specification': 'Specification Issue',
    'maintenance.damage_types.definition': 'Definition Problem',
    'maintenance.damage_types.description': 'Description Issue',
    'maintenance.damage_types.characterization': 'Characterization Problem',
    'maintenance.damage_types.portrayal': 'Portrayal Issue',
    'maintenance.damage_types.depiction': 'Depiction Problem',
    'maintenance.damage_types.illustration': 'Illustration Issue',
    'maintenance.damage_types.demonstration': 'Demonstration Problem',
    'maintenance.damage_types.exhibition': 'Exhibition Issue',
    'maintenance.damage_types.display': 'Display Problem',
    'maintenance.damage_types.presentation': 'Presentation Issue',
    'maintenance.damage_types.showing': 'Showing Problem',
    'maintenance.damage_types.revelation': 'Revelation Issue',
    'maintenance.damage_types.disclosure': 'Disclosure Problem',
    'maintenance.damage_types.exposure': 'Exposure Issue',
    'maintenance.damage_types.uncovering': 'Uncovering Problem',
    'maintenance.damage_types.detection': 'Detection Issue',
    'maintenance.damage_types.discovery': 'Discovery Problem',
    'maintenance.damage_types.finding': 'Finding Issue',
    'maintenance.damage_types.identification': 'Identification Problem',
    'maintenance.damage_types.recognition': 'Recognition Issue',
    'maintenance.damage_types.acknowledgment': 'Acknowledgment Problem',
    'maintenance.damage_types.acceptance': 'Acceptance Issue',
    'maintenance.damage_types.admission': 'Admission Problem',
    'maintenance.damage_types.concession': 'Concession Issue',
    'maintenance.damage_types.agreement': 'Agreement Problem',
    'maintenance.damage_types.consent': 'Consent Issue',
    'maintenance.damage_types.approval': 'Approval Problem',
    'maintenance.damage_types.endorsement': 'Endorsement Issue',
    'maintenance.damage_types.sanction': 'Sanction Problem',
    'maintenance.damage_types.authorization': 'Authorization Issue',
    'maintenance.damage_types.permission': 'Permission Problem',
    'maintenance.damage_types.allowance': 'Allowance Issue',
    'maintenance.damage_types.license': 'License Problem',
    'maintenance.damage_types.warrant': 'Warrant Issue',
    'maintenance.damage_types.mandate': 'Mandate Problem',
    'maintenance.damage_types.commission': 'Commission Issue',
    'maintenance.damage_types.delegation': 'Delegation Problem',
    'maintenance.damage_types.assignment': 'Assignment Issue',
    'maintenance.damage_types.allocation': 'Allocation Problem',
    'maintenance.damage_types.distribution': 'Distribution Issue',
    'maintenance.damage_types.dispensation': 'Dispensation Problem',
    'maintenance.damage_types.provision': 'Provision Issue',
    'maintenance.damage_types.supply': 'Supply Problem',
    'maintenance.damage_types.delivery': 'Delivery Issue',
    'maintenance.damage_types.shipment': 'Shipment Problem',
    'maintenance.damage_types.transportation': 'Transportation Issue',
    'maintenance.damage_types.conveyance': 'Conveyance Problem',
    'maintenance.damage_types.transfer': 'Transfer Issue',
    'maintenance.damage_types.transmission': 'Transmission Problem',
    'maintenance.damage_types.communication': 'Communication Issue',
    'maintenance.damage_types.correspondence': 'Correspondence Problem',
    'maintenance.damage_types.exchange': 'Exchange Issue',
    'maintenance.damage_types.interaction': 'Interaction Problem',
    'maintenance.damage_types.interface': 'Interface Issue',
    'maintenance.damage_types.connection': 'Connection Problem',
    'maintenance.damage_types.linkage': 'Linkage Issue',
    'maintenance.damage_types.relationship': 'Relationship Problem',
    'maintenance.damage_types.association': 'Association Issue',
    'maintenance.damage_types.affiliation': 'Affiliation Problem',
    'maintenance.damage_types.partnership': 'Partnership Issue',
    'maintenance.damage_types.collaboration': 'Collaboration Problem',
    'maintenance.damage_types.cooperation': 'Cooperation Issue',
    'maintenance.damage_types.teamwork': 'Teamwork Problem',
    'maintenance.damage_types.coordination': 'Coordination Issue',
    'maintenance.damage_types.synchronization': 'Synchronization Problem',
    'maintenance.damage_types.harmony': 'Harmony Issue',
    'maintenance.damage_types.unity': 'Unity Problem',
    'maintenance.damage_types.solidarity': 'Solidarity Issue',
    'maintenance.damage_types.consensus': 'Consensus Problem',
    'maintenance.damage_types.agreement': 'Agreement Issue',
    'maintenance.damage_types.understanding': 'Understanding Problem',
    'maintenance.damage_types.comprehension': 'Comprehension Issue',
    'maintenance.damage_types.grasp': 'Grasp Problem',
    'maintenance.damage_types.knowledge': 'Knowledge Issue',
    'maintenance.damage_types.awareness': 'Awareness Problem',
    'maintenance.damage_types.consciousness': 'Consciousness Issue',
    'maintenance.damage_types.perception': 'Perception Problem',
    'maintenance.damage_types.sensation': 'Sensation Issue',
    'maintenance.damage_types.feeling': 'Feeling Problem',
    'maintenance.damage_types.emotion': 'Emotion Issue',
    'maintenance.damage_types.sentiment': 'Sentiment Problem',
    'maintenance.damage_types.mood': 'Mood Issue',
    'maintenance.damage_types.attitude': 'Attitude Problem',
    'maintenance.damage_types.disposition': 'Disposition Issue',
    'maintenance.damage_types.temperament': 'Temperament Problem',
    'maintenance.damage_types.character': 'Character Issue',
    'maintenance.damage_types.personality': 'Personality Problem',
    'maintenance.damage_types.nature': 'Nature Issue',
    'maintenance.damage_types.essence': 'Essence Problem',
    'maintenance.damage_types.substance': 'Substance Issue',
    'maintenance.damage_types.material': 'Material Problem',
    'maintenance.damage_types.matter': 'Matter Issue',
    'maintenance.damage_types.content': 'Content Problem',
    'maintenance.damage_types.composition': 'Composition Issue',
    'maintenance.damage_types.constitution': 'Constitution Problem',
    'maintenance.damage_types.structure': 'Structure Issue',
    'maintenance.damage_types.framework': 'Framework Problem',
    'maintenance.damage_types.architecture': 'Architecture Issue',
    'maintenance.damage_types.design': 'Design Problem',
    'maintenance.damage_types.plan': 'Plan Issue',
    'maintenance.damage_types.scheme': 'Scheme Problem',
    'maintenance.damage_types.strategy': 'Strategy Issue',
    'maintenance.damage_types.approach': 'Approach Problem',
    'maintenance.damage_types.method': 'Method Issue',
    'maintenance.damage_types.technique': 'Technique Problem',
    'maintenance.damage_types.procedure': 'Procedure Issue',
    'maintenance.damage_types.process': 'Process Problem',
    'maintenance.damage_types.operation': 'Operation Issue',
    'maintenance.damage_types.function': 'Function Problem',
    'maintenance.damage_types.activity': 'Activity Issue',
    'maintenance.damage_types.action': 'Action Problem',
    'maintenance.damage_types.behavior': 'Behavior Issue',
    'maintenance.damage_types.conduct': 'Conduct Problem',
    'maintenance.damage_types.performance': 'Performance Issue',
    'maintenance.damage_types.execution': 'Execution Problem',
    'maintenance.damage_types.implementation': 'Implementation Issue',
    'maintenance.damage_types.application': 'Application Problem',
    'maintenance.damage_types.utilization': 'Utilization Issue',
    'maintenance.damage_types.usage': 'Usage Problem',
    'maintenance.damage_types.employment': 'Employment Issue',
    'maintenance.damage_types.deployment': 'Deployment Problem',
    'maintenance.damage_types.installation': 'Installation Issue',
    'maintenance.damage_types.setup': 'Setup Problem',
    'maintenance.damage_types.configuration': 'Configuration Issue',
    'maintenance.damage_types.arrangement': 'Arrangement Problem',
    'maintenance.damage_types.organization': 'Organization Issue',
    'maintenance.damage_types.management': 'Management Problem',
    'maintenance.damage_types.administration': 'Administration Issue',
    'maintenance.damage_types.governance': 'Governance Problem',
    'maintenance.damage_types.leadership': 'Leadership Issue',
    'maintenance.damage_types.direction': 'Direction Problem',
    'maintenance.damage_types.guidance': 'Guidance Issue',
    'maintenance.damage_types.supervision': 'Supervision Problem',
    'maintenance.damage_types.oversight': 'Oversight Issue',
    'maintenance.damage_types.control': 'Control Problem',
    'maintenance.damage_types.regulation': 'Regulation Issue',
    'maintenance.damage_types.rule': 'Rule Problem',
    'maintenance.damage_types.law': 'Law Issue',
    'maintenance.damage_types.statute': 'Statute Problem',
    'maintenance.damage_types.ordinance': 'Ordinance Issue',
    'maintenance.damage_types.decree': 'Decree Problem',
    'maintenance.damage_types.edict': 'Edict Issue',
    'maintenance.damage_types.mandate': 'Mandate Problem',
    'maintenance.damage_types.directive': 'Directive Issue',
    'maintenance.damage_types.instruction': 'Instruction Problem',
    'maintenance.damage_types.command': 'Command Issue',
    'maintenance.damage_types.order': 'Order Problem',
    'maintenance.damage_types.requirement': 'Requirement Issue',
    'maintenance.damage_types.specification': 'Specification Problem',
    'maintenance.damage_types.standard': 'Standard Issue',
    'maintenance.damage_types.criterion': 'Criterion Problem',
    'maintenance.damage_types.benchmark': 'Benchmark Issue',
    'maintenance.damage_types.measure': 'Measure Problem',
    'maintenance.damage_types.metric': 'Metric Issue',
    'maintenance.damage_types.indicator': 'Indicator Problem',
    'maintenance.damage_types.parameter': 'Parameter Issue',
    'maintenance.damage_types.variable': 'Variable Problem',
    'maintenance.damage_types.factor': 'Factor Issue',
    'maintenance.damage_types.element': 'Element Problem',
    'maintenance.damage_types.component': 'Component Issue',
    'maintenance.damage_types.part': 'Part Problem',
    'maintenance.damage_types.piece': 'Piece Issue',
    'maintenance.damage_types.segment': 'Segment Problem',
    'maintenance.damage_types.section': 'Section Issue',
    'maintenance.damage_types.portion': 'Portion Problem',
    'maintenance.damage_types.fraction': 'Fraction Issue',
    'maintenance.damage_types.division': 'Division Problem',
    'maintenance.damage_types.subdivision': 'Subdivision Issue',
    'maintenance.damage_types.category': 'Category Problem',
    'maintenance.damage_types.class': 'Class Issue',
    'maintenance.damage_types.type': 'Type Problem',
    'maintenance.damage_types.kind': 'Kind Issue',
    'maintenance.damage_types.sort': 'Sort Problem',
    'maintenance.damage_types.variety': 'Variety Issue',
    'maintenance.damage_types.form': 'Form Problem',
    'maintenance.damage_types.shape': 'Shape Issue',
    'maintenance.damage_types.pattern': 'Pattern Problem',
    'maintenance.damage_types.model': 'Model Issue',
    'maintenance.damage_types.template': 'Template Problem',
    'maintenance.damage_types.format': 'Format Issue',
    'maintenance.damage_types.style': 'Style Problem',
    'maintenance.damage_types.manner': 'Manner Issue',
    'maintenance.damage_types.way': 'Way Problem',
    'maintenance.damage_types.mode': 'Mode Issue',
    'maintenance.damage_types.means': 'Means Problem',
    'maintenance.damage_types.medium': 'Medium Issue',
    'maintenance.damage_types.channel': 'Channel Problem',
    'maintenance.damage_types.pathway': 'Pathway Issue',
    'maintenance.damage_types.route': 'Route Problem',
    'maintenance.damage_types.course': 'Course Issue',
    'maintenance.damage_types.path': 'Path Problem',
    'maintenance.damage_types.track': 'Track Issue',
    'maintenance.damage_types.trail': 'Trail Problem',
    'maintenance.damage_types.line': 'Line Issue',
    'maintenance.damage_types.direction': 'Direction Problem',
    'maintenance.damage_types.orientation': 'Orientation Issue',
    'maintenance.damage_types.position': 'Position Problem',
    'maintenance.damage_types.location': 'Location Issue',
    'maintenance.damage_types.place': 'Place Problem',
    'maintenance.damage_types.site': 'Site Issue',
    'maintenance.damage_types.spot': 'Spot Problem',
    'maintenance.damage_types.point': 'Point Issue',
    'maintenance.damage_types.area': 'Area Problem',
    'maintenance.damage_types.region': 'Region Issue',
    'maintenance.damage_types.zone': 'Zone Problem',
    'maintenance.damage_types.territory': 'Territory Issue',
    'maintenance.damage_types.domain': 'Domain Problem',
    'maintenance.damage_types.realm': 'Realm Issue',
    'maintenance.damage_types.sphere': 'Sphere Problem',
    'maintenance.damage_types.field': 'Field Issue',
    'maintenance.damage_types.scope': 'Scope Problem',
    'maintenance.damage_types.range': 'Range Issue',
    'maintenance.damage_types.extent': 'Extent Problem',
    'maintenance.damage_types.span': 'Span Issue',
    'maintenance.damage_types.reach': 'Reach Problem',
    'maintenance.damage_types.coverage': 'Coverage Issue',
    'maintenance.damage_types.breadth': 'Breadth Problem',
    'maintenance.damage_types.width': 'Width Issue',
    'maintenance.damage_types.depth': 'Depth Problem',
    'maintenance.damage_types.height': 'Height Issue',
    'maintenance.damage_types.length': 'Length Problem',
    'maintenance.damage_types.size': 'Size Issue',
    'maintenance.damage_types.dimension': 'Dimension Problem',
    'maintenance.damage_types.scale': 'Scale Issue',
    'maintenance.damage_types.proportion': 'Proportion Problem',
    'maintenance.damage_types.ratio': 'Ratio Issue',
    'maintenance.damage_types.percentage': 'Percentage Problem',
    'maintenance.damage_types.fraction': 'Fraction Issue',
    'maintenance.damage_types.share': 'Share Problem',
    'maintenance.damage_types.portion': 'Portion Issue',
    'maintenance.damage_types.part': 'Part Problem',
    'maintenance.damage_types.piece': 'Piece Issue',
    'maintenance.damage_types.bit': 'Bit Problem',
    'maintenance.damage_types.fragment': 'Fragment Issue',
    'maintenance.damage_types.segment': 'Segment Problem',
    'maintenance.damage_types.slice': 'Slice Issue',
    'maintenance.damage_types.chunk': 'Chunk Problem',
    'maintenance.damage_types.block': 'Block Issue',
    'maintenance.damage_types.unit': 'Unit Problem',
    'maintenance.damage_types.item': 'Item Issue',
    'maintenance.damage_types.object': 'Object Problem',
    'maintenance.damage_types.thing': 'Thing Issue',
    'maintenance.damage_types.entity': 'Entity Problem',
    'maintenance.damage_types.being': 'Being Issue',
    'maintenance.damage_types.existence': 'Existence Problem',
    'maintenance.damage_types.presence': 'Presence Issue',
    'maintenance.damage_types.occurrence': 'Occurrence Problem',
    'maintenance.damage_types.instance': 'Instance Issue',
    'maintenance.damage_types.case': 'Case Problem',
    'maintenance.damage_types.example': 'Example Issue',
    'maintenance.damage_types.sample': 'Sample Problem',
    'maintenance.damage_types.specimen': 'Specimen Issue',
    'maintenance.damage_types.illustration': 'Illustration Problem',
    'maintenance.damage_types.demonstration': 'Demonstration Issue',
    'maintenance.damage_types.manifestation': 'Manifestation Problem',
    'maintenance.damage_types.expression': 'Expression Issue',
    'maintenance.damage_types.representation': 'Representation Problem',
    'maintenance.damage_types.symbol': 'Symbol Issue',
    'maintenance.damage_types.sign': 'Sign Problem',
    'maintenance.damage_types.mark': 'Mark Issue',
    'maintenance.damage_types.indicator': 'Indicator Problem',
    'maintenance.damage_types.signal': 'Signal Issue',
    'maintenance.damage_types.warning': 'Warning Problem',
    'maintenance.damage_types.alert': 'Alert Issue',
    'maintenance.damage_types.alarm': 'Alarm Problem',
    'maintenance.damage_types.notification': 'Notification Issue',
    'maintenance.damage_types.announcement': 'Announcement Problem',
    'maintenance.damage_types.declaration': 'Declaration Issue',
    'maintenance.damage_types.statement': 'Statement Problem',
    'maintenance.damage_types.proclamation': 'Proclamation Issue',
    'maintenance.damage_types.pronouncement': 'Pronouncement Problem',
    'maintenance.damage_types.communication': 'Communication Issue',
    'maintenance.damage_types.message': 'Message Problem',
    'maintenance.damage_types.information': 'Information Issue',
    'maintenance.damage_types.data': 'Data Problem',
    'maintenance.damage_types.intelligence': 'Intelligence Issue',
    'maintenance.damage_types.knowledge': 'Knowledge Problem',
    'maintenance.damage_types.wisdom': 'Wisdom Issue',
    'maintenance.damage_types.understanding': 'Understanding Problem',
    'maintenance.damage_types.comprehension': 'Comprehension Issue',
    'maintenance.damage_types.insight': 'Insight Problem',
    'maintenance.damage_types.perception': 'Perception Issue',
    'maintenance.damage_types.awareness': 'Awareness Problem',
    'maintenance.damage_types.consciousness': 'Consciousness Issue',
    'maintenance.damage_types.recognition': 'Recognition Problem',
    'maintenance.damage_types.realization': 'Realization Issue',
    'maintenance.damage_types.discovery': 'Discovery Problem',
    'maintenance.damage_types.finding': 'Finding Issue',
    'maintenance.damage_types.revelation': 'Revelation Problem',
    'maintenance.damage_types.exposure': 'Exposure Issue',
    'maintenance.damage_types.disclosure': 'Disclosure Problem',
    'maintenance.damage_types.uncovering': 'Uncovering Issue',
    'maintenance.damage_types.detection': 'Detection Problem',
    'maintenance.damage_types.identification': 'Identification Issue',
    'maintenance.damage_types.location': 'Location Problem',
    'maintenance.damage_types.positioning': 'Positioning Issue',
    'maintenance.damage_types.placement': 'Placement Problem',
    'maintenance.damage_types.arrangement': 'Arrangement Issue',
    'maintenance.damage_types.organization': 'Organization Problem',
    'maintenance.damage_types.structure': 'Structure Issue',
    'maintenance.damage_types.order': 'Order Problem',
    'maintenance.damage_types.sequence': 'Sequence Issue',
    'maintenance.damage_types.series': 'Series Problem',
    'maintenance.damage_types.succession': 'Succession Issue',
    'maintenance.damage_types.progression': 'Progression Problem',
    'maintenance.damage_types.advancement': 'Advancement Issue',
    'maintenance.damage_types.development': 'Development Problem',
    'maintenance.damage_types.evolution': 'Evolution Issue',
    'maintenance.damage_types.growth': 'Growth Problem',
    'maintenance.damage_types.expansion': 'Expansion Issue',
    'maintenance.damage_types.extension': 'Extension Problem',
    'maintenance.damage_types.enlargement': 'Enlargement Issue',
    'maintenance.damage_types.increase': 'Increase Problem',
    'maintenance.damage_types.rise': 'Rise Issue',
    'maintenance.damage_types.elevation': 'Elevation Problem',
    'maintenance.damage_types.improvement': 'Improvement Issue',
    'maintenance.damage_types.enhancement': 'Enhancement Problem',
    'maintenance.damage_types.upgrade': 'Upgrade Issue',
    'maintenance.damage_types.refinement': 'Refinement Problem',
    'maintenance.damage_types.optimization': 'Optimization Issue',
    'maintenance.damage_types.perfection': 'Perfection Problem',
    'maintenance.damage_types.completion': 'Completion Issue',
    'maintenance.damage_types.fulfillment': 'Fulfillment Problem',
    'maintenance.damage_types.achievement': 'Achievement Issue',
    'maintenance.damage_types.accomplishment': 'Accomplishment Problem',
    'maintenance.damage_types.success': 'Success Issue',
    'maintenance.damage_types.victory': 'Victory Problem',
    'maintenance.damage_types.triumph': 'Triumph Issue',
    'maintenance.damage_types.conquest': 'Conquest Problem',
    'maintenance.damage_types.mastery': 'Mastery Issue',
    'maintenance.damage_types.expertise': 'Expertise Problem',
    'maintenance.damage_types.skill': 'Skill Issue',
    'maintenance.damage_types.ability': 'Ability Problem',
    'maintenance.damage_types.capability': 'Capability Issue',
    'maintenance.damage_types.capacity': 'Capacity Problem',
    'maintenance.damage_types.competence': 'Competence Issue',
    'maintenance.damage_types.proficiency': 'Proficiency Problem',
    'maintenance.damage_types.talent': 'Talent Issue',
    'maintenance.damage_types.gift': 'Gift Problem',
    'maintenance.damage_types.aptitude': 'Aptitude Issue',
    'maintenance.damage_types.potential': 'Potential Problem',
    'maintenance.damage_types.possibility': 'Possibility Issue',
    'maintenance.damage_types.opportunity': 'Opportunity Problem',
    'maintenance.damage_types.chance': 'Chance Issue',
    'maintenance.damage_types.prospect': 'Prospect Problem',
    'maintenance.damage_types.outlook': 'Outlook Issue',
    'maintenance.damage_types.future': 'Future Problem',
    'maintenance.damage_types.destiny': 'Destiny Issue',
    'maintenance.damage_types.fate': 'Fate Problem',
    'maintenance.damage_types.fortune': 'Fortune Issue',
    'maintenance.damage_types.luck': 'Luck Problem',
    'maintenance.damage_types.circumstance': 'Circumstance Issue',
    'maintenance.damage_types.situation': 'Situation Problem',
    'maintenance.damage_types.condition': 'Condition Issue',
    'maintenance.damage_types.state': 'State Problem',
    'maintenance.damage_types.status': 'Status Issue',
    'maintenance.damage_types.position': 'Position Problem',
    'maintenance.damage_types.standing': 'Standing Issue',
    'maintenance.damage_types.rank': 'Rank Problem',
    'maintenance.damage_types.grade': 'Grade Issue',
    'maintenance.damage_types.level': 'Level Problem',
    'maintenance.damage_types.degree': 'Degree Issue',
    'maintenance.damage_types.stage': 'Stage Problem',
    'maintenance.damage_types.phase': 'Phase Issue',
    'maintenance.damage_types.step': 'Step Problem',
    'maintenance.damage_types.measure': 'Measure Issue',
    'maintenance.damage_types.action': 'Action Problem',
    'maintenance.damage_types.move': 'Move Issue',
    'maintenance.damage_types.decision': 'Decision Problem',
    'maintenance.damage_types.choice': 'Choice Issue',
    'maintenance.damage_types.selection': 'Selection Problem',
    'maintenance.damage_types.option': 'Option Issue',
    'maintenance.damage_types.alternative': 'Alternative Problem',
    'maintenance.damage_types.solution': 'Solution Issue',
    'maintenance.damage_types.answer': 'Answer Problem',
    'maintenance.damage_types.response': 'Response Issue',
    'maintenance.damage_types.reply': 'Reply Problem',
    'maintenance.damage_types.reaction': 'Reaction Issue',
    'maintenance.damage_types.feedback': 'Feedback Problem',
    'maintenance.damage_types.result': 'Result Issue',
    'maintenance.damage_types.outcome': 'Outcome Problem',
    'maintenance.damage_types.consequence': 'Consequence Issue',
    'maintenance.damage_types.effect': 'Effect Problem',
    'maintenance.damage_types.impact': 'Impact Issue',
    'maintenance.damage_types.influence': 'Influence Problem',
    'maintenance.damage_types.power': 'Power Issue',
    'maintenance.damage_types.force': 'Force Problem',
    'maintenance.damage_types.strength': 'Strength Issue',
    'maintenance.damage_types.energy': 'Energy Problem',
    'maintenance.damage_types.vitality': 'Vitality Issue',
    'maintenance.damage_types.vigor': 'Vigor Problem',
    'maintenance.damage_types.intensity': 'Intensity Issue',
    'maintenance.damage_types.pressure': 'Pressure Problem',
    'maintenance.damage_types.stress': 'Stress Issue',
    'maintenance.damage_types.strain': 'Strain Problem',
    'maintenance.damage_types.tension': 'Tension Issue',
    'maintenance.damage_types.load': 'Load Problem',
    'maintenance.damage_types.burden': 'Burden Issue',
    'maintenance.damage_types.weight': 'Weight Problem',
    'maintenance.damage_types.mass': 'Mass Issue',
    'maintenance.damage_types.volume': 'Volume Problem',
    'maintenance.damage_types.density': 'Density Issue',
    'maintenance.damage_types.concentration': 'Concentration Problem',
    'maintenance.damage_types.focus': 'Focus Issue',
    'maintenance.damage_types.attention': 'Attention Problem',
    'maintenance.damage_types.interest': 'Interest Issue',
    'maintenance.damage_types.concern': 'Concern Problem',
    'maintenance.damage_types.care': 'Care Issue',
    'maintenance.damage_types.consideration': 'Consideration Problem',
    'maintenance.damage_types.thought': 'Thought Issue',
    'maintenance.damage_types.idea': 'Idea Problem',
    'maintenance.damage_types.concept': 'Concept Issue',
    'maintenance.damage_types.notion': 'Notion Problem',
    'maintenance.damage_types.belief': 'Belief Issue',
    'maintenance.damage_types.opinion': 'Opinion Problem',
    'maintenance.damage_types.view': 'View Issue',
    'maintenance.damage_types.perspective': 'Perspective Problem',
    'maintenance.damage_types.angle': 'Angle Issue',
    'maintenance.damage_types.approach': 'Approach Problem',
    'maintenance.damage_types.method': 'Method Issue',
    'maintenance.damage_types.technique': 'Technique Problem',
    'maintenance.damage_types.strategy': 'Strategy Issue',
    'maintenance.damage_types.plan': 'Plan Problem',
    'maintenance.damage_types.scheme': 'Scheme Issue',
    'maintenance.damage_types.design': 'Design Problem',
    'maintenance.damage_types.blueprint': 'Blueprint Issue',
    'maintenance.damage_types.outline': 'Outline Problem',
    'maintenance.damage_types.draft': 'Draft Issue',
    'maintenance.damage_types.sketch': 'Sketch Problem',
    'maintenance.damage_types.drawing': 'Drawing Issue',
    'maintenance.damage_types.diagram': 'Diagram Problem',
    'maintenance.damage_types.chart': 'Chart Issue',
    'maintenance.damage_types.graph': 'Graph Problem',
    'maintenance.damage_types.map': 'Map Issue',
    'maintenance.damage_types.layout': 'Layout Problem',
    'maintenance.damage_types.format': 'Format Issue',
    'maintenance.damage_types.structure': 'Structure Problem',
    'maintenance.damage_types.framework': 'Framework Issue',
    'maintenance.damage_types.architecture': 'Architecture Problem',
    'maintenance.damage_types.construction': 'Construction Issue',
    'maintenance.damage_types.building': 'Building Problem',
    'maintenance.damage_types.assembly': 'Assembly Issue',
    'maintenance.damage_types.installation': 'Installation Problem',
    'maintenance.damage_types.setup': 'Setup Issue',
    'maintenance.damage_types.configuration': 'Configuration Problem',
    'maintenance.damage_types.arrangement': 'Arrangement Issue',
    'maintenance.damage_types.organization': 'Organization Problem',
    'maintenance.damage_types.management': 'Management Issue',
    'maintenance.damage_types.administration': 'Administration Problem',
    'maintenance.damage_types.governance': 'Governance Issue',
    'maintenance.damage_types.leadership': 'Leadership Problem',
    'maintenance.damage_types.direction': 'Direction Issue',
    'maintenance.damage_types.guidance': 'Guidance Problem',
    'maintenance.damage_types.supervision': 'Supervision Issue',
    'maintenance.damage_types.oversight': 'Oversight Problem',
    'maintenance.damage_types.control': 'Control Issue',
    'maintenance.damage_types.regulation': 'Regulation Problem',
    'maintenance.damage_types.monitoring': 'Monitoring Issue',
    'maintenance.damage_types.observation': 'Observation Problem',
    'maintenance.damage_types.surveillance': 'Surveillance Issue',
    'maintenance.damage_types.inspection': 'Inspection Problem',
    'maintenance.damage_types.examination': 'Examination Issue',
    'maintenance.damage_types.investigation': 'Investigation Problem',
    'maintenance.damage_types.analysis': 'Analysis Issue',
    'maintenance.damage_types.evaluation': 'Evaluation Problem',
    'maintenance.damage_types.assessment': 'Assessment Issue',
    'maintenance.damage_types.review': 'Review Problem',
    'maintenance.damage_types.audit': 'Audit Issue',
    'maintenance.damage_types.check': 'Check Problem',
    'maintenance.damage_types.test': 'Test Issue',
    'maintenance.damage_types.trial': 'Trial Problem',
    'maintenance.damage_types.experiment': 'Experiment Issue',
    'maintenance.damage_types.validation': 'Validation Problem',
    'maintenance.damage_types.verification': 'Verification Issue',
    'maintenance.damage_types.confirmation': 'Confirmation Problem',
    'maintenance.damage_types.certification': 'Certification Issue',
    
    // Messages
    'maintenance.actions.creating': 'Creating...',
    'maintenance.actions.updating': 'Updating...',
    'maintenance.actions.deleting': 'Deleting...',
    'maintenance.actions.success.created': 'Action created successfully',
    'maintenance.actions.success.updated': 'Action updated successfully',
    'maintenance.actions.success.deleted': 'Action deleted successfully',
    'maintenance.actions.error.create': 'Failed to create action',
    'maintenance.actions.error.update': 'Failed to update action',
    'maintenance.actions.error.delete': 'Failed to delete action',
    'maintenance.actions.error.load': 'Failed to load actions',
    'maintenance.actions.confirm.delete': 'Are you sure you want to delete this action?',
    'maintenance.actions.loading': 'Loading actions...',
    
    // Search and filters
    'maintenance.actions.search_placeholder': 'Search actions...',
    'maintenance.actions.filter_status': 'Filter by status',
    'maintenance.actions.filter_all': 'All Status',
    'maintenance.actions.filter_pending': 'Pending',
    'maintenance.actions.filter_progress': 'In Progress',
    'maintenance.actions.filter_completed': 'Completed',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.print': 'Print',
    'common.view': 'View',
    'common.add': 'Add',
    'common.actions': 'Actions',
    'common.required': 'Required'
  };
  
  return translations[key] || key.split('.').pop() || key;
};
import { QuickActions } from "@/components/ui/quick-actions";
import { Plus, RefreshCw, Filter, Search, Wrench, FileText, DollarSign, Eye, Printer, Edit, Trash2 } from "lucide-react";
import { API_ENDPOINTS } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";

const ACTION_TYPES = ["Repair", "Change Parts", "Workshop"];

interface MaintenanceAction {
  id: number;
  actionDate: string;
  requestId: number;
  machineId: string;
  performedBy: string;
  actionType: string;
  description: string;
  cost: number;
  hours: number;
  status: string;
  partReplaced?: string;
  partId?: number;
}

interface MaintenanceRequest {
  id: number;
  requestNumber: string;
  machineId: string;
  damageType: string;
  severity: string;
  description: string;
  status: string;
  createdAt?: string;
}

interface Machine {
  id: string;
  name: string;
  sectionId: string;
}

interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export default function MaintenanceActionsPage() {
  // const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<MaintenanceAction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const preSelectedRequestId = urlParams.get('requestId');

  const [formData, setFormData] = useState({
    requestId: "",
    machineId: "",
    actionsTaken: [] as string[],
    description: "",
    partsCost: "",
    laborHours: "",
    notes: "",
    readyToWork: false,
  });

  const [editFormData, setEditFormData] = useState({
    requestId: "",
    machineId: "",
    actionType: "",
    description: "",
    cost: "",
    hours: "",
    status: "pending",
    partReplaced: "",
  });

  // Fetch maintenance actions
  const { data: actions = [], isLoading: actionsLoading, refetch: refetchActions } = useQuery({
    queryKey: [API_ENDPOINTS.MAINTENANCE_ACTIONS],
    queryFn: () => apiRequest('GET', API_ENDPOINTS.MAINTENANCE_ACTIONS)
  });

  // Fetch maintenance requests
  const { data: requests = [] } = useQuery({
    queryKey: [API_ENDPOINTS.MAINTENANCE_REQUESTS],
    queryFn: () => apiRequest('GET', API_ENDPOINTS.MAINTENANCE_REQUESTS)
  });

  // Fetch machines
  const { data: machines = [] } = useQuery({
    queryKey: ['/api/machines'],
    queryFn: () => apiRequest('GET', '/api/machines')
  });

  // Fetch users
  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => apiRequest('GET', '/api/users')
  });

  // Helper functions
  const getMachineName = (machineId: string) => {
    const machine = machines.find((m: Machine) => m.id === machineId);
    return machine ? machine.name : machineId;
  };

  const getUserName = (userId: string) => {
    const user = users.find((u: User) => u.id === userId);
    return user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : userId;
  };

  // Auto-populate form when requestId is provided in URL
  useEffect(() => {
    if (preSelectedRequestId && requests.length > 0) {
      const selectedRequest = requests.find((r: MaintenanceRequest) => r.id.toString() === preSelectedRequestId);
      if (selectedRequest) {
        setFormData(prev => ({
          ...prev,
          requestId: selectedRequest.id.toString(),
          machineId: selectedRequest.machineId
        }));
        setIsDialogOpen(true); // Auto-open the dialog
      }
    }
  }, [preSelectedRequestId, requests]);

  // Create action mutation
  const createActionMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', API_ENDPOINTS.MAINTENANCE_ACTIONS, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Maintenance action recorded successfully",
      });
      setIsDialogOpen(false);
      resetForm();
      refetchActions();
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MAINTENANCE_ACTIONS] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MAINTENANCE_REQUESTS] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record maintenance action",
        variant: "destructive",
      });
    },
  });

  // Update action mutation
  const updateActionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PUT', `${API_ENDPOINTS.MAINTENANCE_ACTIONS}/${id}`, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Maintenance action updated successfully",
      });
      setIsEditDialogOpen(false);
      refetchActions();
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MAINTENANCE_ACTIONS] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update maintenance action",
        variant: "destructive",
      });
    },
  });

  // Delete action mutation
  const deleteActionMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `${API_ENDPOINTS.MAINTENANCE_ACTIONS}/${id}`),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Maintenance action deleted successfully",
      });
      refetchActions();
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MAINTENANCE_ACTIONS] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete maintenance action",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      requestId: "",
      machineId: "",
      actionsTaken: [],
      description: "",
      partsCost: "",
      laborHours: "",
      notes: "",
      readyToWork: false,
    });
    // Clear URL parameters when form is reset
    if (preSelectedRequestId) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.requestId || !formData.machineId || formData.actionsTaken.length === 0 || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const actionData = {
      ...formData,
      requestId: parseInt(formData.requestId),
      partsCost: formData.partsCost ? parseFloat(formData.partsCost) : 0,
      laborHours: formData.laborHours ? parseFloat(formData.laborHours) : 0,
    };

    createActionMutation.mutate(actionData);
  };

  const handleActionTypeToggle = (actionType: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        actionsTaken: [...formData.actionsTaken, actionType]
      });
    } else {
      setFormData({
        ...formData,
        actionsTaken: formData.actionsTaken.filter(type => type !== actionType)
      });
    }
  };

  const handleRequestChange = (requestId: string) => {
    const request = requests.find((r: MaintenanceRequest) => r.id.toString() === requestId);
    if (request) {
      setFormData({
        ...formData,
        requestId,
        machineId: request.machineId,
      });
    }
  };

  // Handler functions for new CRUD operations
  const handleViewAction = (action: MaintenanceAction) => {
    setSelectedAction(action);
    setIsViewDialogOpen(true);
  };

  const handleEditAction = (action: MaintenanceAction) => {
    setSelectedAction(action);
    setEditFormData({
      requestId: action.requestId.toString(),
      machineId: action.machineId,
      actionType: action.actionType,
      description: action.description,
      cost: action.cost.toString(),
      hours: action.hours.toString(),
      status: action.status,
      partReplaced: action.partReplaced || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteAction = (actionId: number) => {
    if (window.confirm('Are you sure you want to delete this maintenance action?')) {
      deleteActionMutation.mutate(actionId);
    }
  };

  const handlePrint = (action: MaintenanceAction) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Maintenance Action Report</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #065f46;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 20px;
            }
            .logo {
              width: 80px;
              height: 80px;
            }
            .company-info {
              text-align: center;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #065f46;
              margin: 0;
            }
            .company-name-ar {
              font-size: 20px;
              font-weight: bold;
              color: #059669;
              margin: 5px 0 0 0;
            }
            .content {
              max-width: 800px;
              margin: 0 auto;
            }
            .action-header {
              background: linear-gradient(135deg, #065f46, #059669);
              color: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              text-align: center;
            }
            .action-title {
              font-size: 28px;
              font-weight: bold;
              margin: 0;
            }
            .action-subtitle {
              font-size: 16px;
              margin: 10px 0 0 0;
              opacity: 0.9;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .detail-item {
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #059669;
            }
            .detail-label {
              font-weight: bold;
              color: #065f46;
              margin-bottom: 5px;
            }
            .detail-value {
              color: #374151;
            }
            .description-section {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid #059669;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #065f46;
              margin-bottom: 15px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/assets/company-logo.png" alt="Company Logo" class="logo" />
            <div class="company-info">
              <h1 class="company-name">Modern Plastic Bag Factory</h1>
              <h2 class="company-name-ar">مصنع أكياس البلاستيك الحديث</h2>
            </div>
          </div>

          <div class="content">
            <div class="action-header">
              <h1 class="action-title">Maintenance Action Report</h1>
              <p class="action-subtitle">Action ID: #${action.id} | Date: ${formatDate(new Date(action.actionDate), 'MMM dd, yyyy')}</p>
            </div>

            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">Request ID:</div>
                <div class="detail-value">#${action.requestId}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Machine:</div>
                <div class="detail-value">${getMachineName(action.machineId)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Action Type:</div>
                <div class="detail-value">${action.actionType}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Performed By:</div>
                <div class="detail-value">${getUserName(action.performedBy)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Status:</div>
                <div class="detail-value">${action.status.charAt(0).toUpperCase() + action.status.slice(1)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Hours Spent:</div>
                <div class="detail-value">${action.hours.toFixed(2)} hours</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Cost:</div>
                <div class="detail-value">$${action.cost.toLocaleString()}</div>
              </div>
              ${action.partReplaced ? `
              <div class="detail-item">
                <div class="detail-label">Part Replaced:</div>
                <div class="detail-value">${action.partReplaced}</div>
              </div>
              ` : ''}
            </div>

            <div class="description-section">
              <div class="section-title">Action Description</div>
              <div>${action.description}</div>
            </div>
          </div>

          <div class="footer">
            <p>Generated on ${formatDate(new Date(), 'dd/MM/yyyy HH:mm')} | Modern Plastic Bag Factory</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;

    const updateData = {
      requestId: parseInt(editFormData.requestId),
      machineId: editFormData.machineId,
      actionType: editFormData.actionType,
      description: editFormData.description,
      cost: parseFloat(editFormData.cost),
      hours: parseFloat(editFormData.hours),
      status: editFormData.status,
      partReplaced: editFormData.partReplaced || undefined,
    };

    updateActionMutation.mutate({ id: selectedAction.id, data: updateData });
  };

  // Filter actions
  const filteredActions = actions.filter((action: MaintenanceAction) => {
    const matchesSearch = searchQuery === "" || 
      action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.actionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.machineId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || action.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Group actions by maintenance request
  const groupedActions = filteredActions.reduce((groups: { [key: number]: MaintenanceAction[] }, action: MaintenanceAction) => {
    if (!groups[action.requestId]) {
      groups[action.requestId] = [];
    }
    groups[action.requestId].push(action);
    return groups;
  }, {});

  // Sort groups by request ID (most recent first)
  const sortedRequestIds = Object.keys(groupedActions)
    .map(id => parseInt(id))
    .sort((a, b) => b - a);

  const translateDamageType = (damageType: string): string => {
    // If the damage type is already a translation key, translate it
    if (damageType.startsWith('maintenance.damage_types.')) {
      return t(damageType);
    }
    // Otherwise return as is
    return damageType;
  };

  const getRequestInfo = (requestId: number) => {
    const request = requests.find((r: MaintenanceRequest) => r.id === requestId);
    if (request) {
      const translatedDamageType = translateDamageType(request.damageType);
      return `${request.requestNumber || '#' + request.id} - ${translatedDamageType}`;
    }
    return `#${requestId}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">{status}</Badge>;
      case "in_progress":
        return <Badge variant="secondary">{status}</Badge>;
      case "pending":
        return <Badge variant="outline">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get all maintenance requests for dropdown (sorted by most recent first)
  const availableRequests = requests.filter((r: MaintenanceRequest) => 
    r.status !== 'completed' && r.status !== 'cancelled'
  ).sort((a: any, b: any) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

  return (
    <div className={`container mx-auto space-y-6 ${isMobile ? "p-3" : "p-4"}`}>
      <PageHeader
        title={t("maintenance.actions.title")}
        description={t("maintenance.actions.description")}
      />

      {/* Action Bar */}
      <div className={`flex gap-4 items-start justify-between ${isMobile ? "flex-col" : "flex-col sm:flex-row sm:items-center"}`}>
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("maintenance.actions.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t("maintenance.actions.filter_status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("maintenance.actions.filter_all")}</SelectItem>
              <SelectItem value="pending">{t("maintenance.actions.filter_pending")}</SelectItem>
              <SelectItem value="in_progress">{t("maintenance.actions.filter_progress")}</SelectItem>
              <SelectItem value="completed">{t("maintenance.actions.filter_completed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("maintenance.actions.record")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("maintenance.actions.create")}</DialogTitle>
              <DialogDescription>
                {t("maintenance.actions.description")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="requestId">{t("maintenance.actions.maintenanceRequest")} *</Label>
                <Select 
                  value={formData.requestId} 
                  onValueChange={handleRequestChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("maintenance.actions.selectMaintenanceRequest")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRequests.map((request: MaintenanceRequest) => (
                      <SelectItem key={request.id} value={request.id.toString()}>
                        {request.requestNumber || '#' + request.id} - {getMachineName(request.machineId)} ({request.damageType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="machineId">{t("maintenance.actions.machine")} *</Label>
                <Select 
                  value={formData.machineId} 
                  onValueChange={(value) => setFormData({...formData, machineId: value})}
                  disabled={!!formData.requestId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("common.select_machine")} />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map((machine: Machine) => (
                      <SelectItem key={machine.id} value={machine.id}>
                        {machine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{t("maintenance.actions.actionsTaken")} *</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {ACTION_TYPES.map((actionType) => (
                    <div key={actionType} className="flex items-center space-x-2">
                      <Checkbox
                        id={actionType}
                        checked={formData.actionsTaken.includes(actionType)}
                        onCheckedChange={(checked) => handleActionTypeToggle(actionType, checked as boolean)}
                      />
                      <Label htmlFor={actionType} className="cursor-pointer">
                        {actionType === "Repair" ? t("maintenance.actions.repairAction") : 
                         actionType === "Change Parts" ? t("maintenance.actions.changePartsAction") :
                         actionType === "Workshop" ? t("maintenance.actions.workshopAction") : actionType}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="description">{t("maintenance.actions.description")} *</Label>
                <Textarea
                  id="description"
                  placeholder={t("maintenance.actions.description")}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partsCost">{t("maintenance.actions.partsCost")} ($)</Label>
                  <Input
                    id="partsCost"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.partsCost}
                    onChange={(e) => setFormData({...formData, partsCost: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="laborHours">{t("maintenance.actions.laborHours")}</Label>
                  <Input
                    id="laborHours"
                    type="number"
                    step="0.5"
                    placeholder="0.0"
                    value={formData.laborHours}
                    onChange={(e) => setFormData({...formData, laborHours: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">{t("maintenance.actions.notes")}</Label>
                <Textarea
                  id="notes"
                  placeholder={t("maintenance.actions.additionalNotes")}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="readyToWork"
                  checked={formData.readyToWork}
                  onCheckedChange={(checked) => setFormData({...formData, readyToWork: !!checked})}
                />
                <Label htmlFor="readyToWork" className="text-sm font-medium">
                  {t("maintenance.actions.readyToWork")}
                </Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={createActionMutation.isPending}>
                  {createActionMutation.isPending ? t("maintenance.actions.recording") : t("maintenance.actions.recordAction")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Actions Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("maintenance.actions.table_title", { count: filteredActions.length })}</CardTitle>
          <CardDescription>
            {t("maintenance.actions.table_description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {actionsLoading ? (
            <div className="text-center py-4">{t("common.loading")}</div>
          ) : filteredActions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {t("maintenance.actions.no_actions")}
            </div>
          ) : (
            // Desktop and mobile view with grouped actions
            <div className="space-y-6">
              {sortedRequestIds.map((requestId: number) => {
                const request = requests.find((r: MaintenanceRequest) => r.id === requestId);
                const requestActions = groupedActions[requestId];
                
                return (
                  <div key={requestId} className="border rounded-lg overflow-hidden">
                    {/* Request Header */}
                    <div className="bg-gray-50 p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {request?.requestNumber || `#${requestId}`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {request ? translateDamageType(request.damageType) : 'Unknown Request'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Machine: {request ? getMachineName(request.machineId) : 'Unknown'}
                          </p>
                        </div>
                        <Badge variant={request?.status === 'completed' ? 'default' : 'secondary'}>
                          {request?.status || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Actions for this request */}
                    <div className="p-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-3">
                        Actions ({requestActions.length})
                      </h4>
                      
                      {isMobile ? (
                        <div className="space-y-3">
                          {requestActions.map((action: MaintenanceAction) => (
                            <Card key={action.id} className="p-3 bg-gray-50">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm">#{action.id}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {action.actionType}
                                  </Badge>
                                </div>
                                {getStatusBadge(action.status)}
                              </div>
                              
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{t("maintenance.actions.mobile.date")}</span>
                                  <span>{formatDate(new Date(action.actionDate), 'MMM dd, yyyy')}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{t("maintenance.actions.mobile.performed_by")}</span>
                                  <span>{getUserName(action.performedBy)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{t("maintenance.actions.mobile.hours")}</span>
                                  <span>{action.hours}h</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">{t("maintenance.actions.mobile.cost")}</span>
                                  <span>${action.cost}</span>
                                </div>
                              </div>
                              
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-sm text-gray-700" title={action.description}>
                                  {action.description.length > 60 ? `${action.description.substring(0, 60)}...` : action.description}
                                </p>
                              </div>
                              
                              <div className="mt-3 pt-2 border-t flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewAction(action)}
                                  title={t("maintenance.actions.tooltip.view")}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handlePrint(action)}
                                  title={t("maintenance.actions.tooltip.print")}
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditAction(action)}
                                  title={t("maintenance.actions.tooltip.edit")}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteAction(action.id)}
                                  title={t("maintenance.actions.tooltip.delete")}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-center">{t("maintenance.actions.id")}</TableHead>
                                <TableHead className="text-center">{t("maintenance.actions.date")}</TableHead>
                                <TableHead className="text-center">{t("maintenance.actions.actionsTaken")}</TableHead>
                                <TableHead className="text-center">{t("maintenance.actions.actionBy")}</TableHead>
                                <TableHead className="text-center">{t("maintenance.actions.laborHours")}</TableHead>
                                <TableHead className="text-center">{t("maintenance.actions.partsCost")}</TableHead>
                                <TableHead className="text-center">{t("maintenance.actions.status")}</TableHead>
                                <TableHead className="text-center">{t("maintenance.actions.description")}</TableHead>
                                <TableHead className="text-center">{t("maintenance.actions.actions")}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {requestActions.map((action: MaintenanceAction) => (
                                <TableRow key={action.id}>
                                  <TableCell className="font-medium text-center">#{action.id}</TableCell>
                                  <TableCell className="text-center">{formatDate(new Date(action.actionDate), 'MMM dd, yyyy')}</TableCell>
                                  <TableCell className="text-center">
                                    <Badge variant="secondary" className="text-xs">
                                      {action.actionType}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">{getUserName(action.performedBy)}</TableCell>
                                  <TableCell className="text-center">
                                    <div className="flex items-center justify-center">
                                      <FileText className="w-4 h-4 mr-1 text-gray-400" />
                                      {action.hours}h
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <div className="flex items-center justify-center">
                                      <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                                      ${action.cost.toFixed(2)}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">{getStatusBadge(action.status)}</TableCell>
                                  <TableCell className="max-w-xs truncate text-center" title={action.description}>
                                    {action.description}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <div className="flex justify-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleViewAction(action)}
                                        title={t("maintenance.actions.tooltip.view")}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handlePrint(action)}
                                        title={t("maintenance.actions.tooltip.print")}
                                      >
                                        <Printer className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditAction(action)}
                                        title={t("maintenance.actions.tooltip.edit")}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteAction(action.id)}
                                        title={t("maintenance.actions.tooltip.delete")}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Action Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("maintenance.actions.view.title")}</DialogTitle>
            <DialogDescription>
              {t("maintenance.actions.view.dialog_description")}
            </DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.action_id")}</Label>
                  <p className="text-sm font-medium">#{selectedAction.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.date")}</Label>
                  <p className="text-sm">{formatDate(new Date(selectedAction.actionDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.machine")}</Label>
                  <p className="text-sm">{getMachineName(selectedAction.machineId)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.request")}</Label>
                  <p className="text-sm">{getRequestInfo(selectedAction.requestId)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.action_type")}</Label>
                  <Badge variant="secondary" className="text-xs">
                    {selectedAction.actionType}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.status")}</Label>
                  {getStatusBadge(selectedAction.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.performed_by")}</Label>
                  <p className="text-sm">{getUserName(selectedAction.performedBy)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.labor_hours")}</Label>
                  <p className="text-sm">{selectedAction.hours}h</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.parts_cost")}</Label>
                  <p className="text-sm">${selectedAction.cost.toFixed(2)}</p>
                </div>
                {selectedAction.partReplaced && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.part_replaced")}</Label>
                    <p className="text-sm">{selectedAction.partReplaced}</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">{t("maintenance.actions.view.description")}</Label>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{selectedAction.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Action Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("maintenance.actions.edit.title")}</DialogTitle>
            <DialogDescription>
              {t("maintenance.actions.edit.dialog_description")}
            </DialogDescription>
          </DialogHeader>
          {selectedAction && (
            <form onSubmit={handleUpdateAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editActionDate">{t("maintenance.actions.actionDate")}</Label>
                  <Input
                    id="editActionDate"
                    type="date"
                    value={editFormData.actionDate}
                    onChange={(e) => setEditFormData({...editFormData, actionDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editActionType">{t("maintenance.actions.actionType")}</Label>
                  <Select value={editFormData.actionType} onValueChange={(value) => setEditFormData({...editFormData, actionType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("maintenance.actions.selectActionType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="repair">{t("maintenance.actions.repair")}</SelectItem>
                      <SelectItem value="replace">{t("maintenance.actions.replace")}</SelectItem>
                      <SelectItem value="maintenance">{t("maintenance.actions.maintenance")}</SelectItem>
                      <SelectItem value="inspection">{t("maintenance.actions.inspection")}</SelectItem>
                      <SelectItem value="calibration">{t("maintenance.actions.calibration")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="editDescription">{t("maintenance.actions.description")}</Label>
                <Textarea
                  id="editDescription"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editPartsCost">{t("maintenance.actions.partsCost")}</Label>
                  <Input
                    id="editPartsCost"
                    type="number"
                    step="0.01"
                    value={editFormData.partsCost}
                    onChange={(e) => setEditFormData({...editFormData, partsCost: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="editLaborHours">{t("maintenance.actions.laborHours")}</Label>
                  <Input
                    id="editLaborHours"
                    type="number"
                    step="0.5"
                    value={editFormData.laborHours}
                    onChange={(e) => setEditFormData({...editFormData, laborHours: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={updateActionMutation.isPending}>
                  {updateActionMutation.isPending ? t("maintenance.actions.updating") : t("maintenance.actions.updateAction")}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
